"""
Rupse Stock Price Prediction
=============================
Trains a Bidirectional LSTM on historical OHLCV data to predict tomorrow's
closing price.

Strategy
--------
The model predicts tomorrow's % return (a stationary, scale-invariant target).
The predicted closing price is then reconstructed as:
    predicted_price = today_close * (1 + predicted_return)

This avoids the systematic underestimation that occurs when predicting raw
prices on a trending asset — a model trained on $40–$150 prices will never
correctly predict $290 prices, but % returns are always small numbers near 0
regardless of the absolute price level.
"""

import numpy as np
from sklearn.preprocessing import MinMaxScaler

from config import TICKER, TRAIN_SPLIT, WINDOW_SIZE, LSTM_FEATURES, TARGET
from src.data_loader import load_stock_data
from src.features import create_features
from src.dataset import create_sequences
from src.model_lstm import build_lstm, get_callbacks
from src.evaluate import evaluate_model
from src.backtest import backtest


def main() -> None:
    print(f"Loading data for {TICKER}...")
    df = load_stock_data(TICKER)

    print("Engineering features...")
    df = create_features(df)

    print(f"Dataset size after feature engineering: {len(df)} rows")
    print(f"Features ({len(LSTM_FEATURES)}): {', '.join(LSTM_FEATURES)}")

    if df.empty:
        raise RuntimeError(
            "No data available after feature engineering. "
            "Check that the download succeeded and the date range is valid."
        )

    # ── Scale features ────────────────────────────────────────────────────────
    # Features are scaled to [0,1]; target (% return) is NOT scaled —
    # returns are already small numbers (~-0.05 to +0.05).
    feat_scaler = MinMaxScaler()
    X_scaled = feat_scaler.fit_transform(df[LSTM_FEATURES].values)
    y = df[TARGET].values  # raw % returns, unscaled

    # ── Build sequences ───────────────────────────────────────────────────────
    X_seq, y_seq = create_sequences(X_scaled, y, window_size=WINDOW_SIZE)

    split = int(len(X_seq) * TRAIN_SPLIT)
    X_train, X_test = X_seq[:split], X_seq[split:]
    y_train, y_test = y_seq[:split], y_seq[split:]

    # today_close[i] = Close on the last day of window i
    # Used to reconstruct: predicted_price = today_close * (1 + predicted_return)
    closes = df["Close"].values
    today_closes = closes[WINDOW_SIZE - 1 : WINDOW_SIZE - 1 + len(X_seq)]
    today_closes_test = today_closes[split:]

    # ── Train ─────────────────────────────────────────────────────────────────
    print("\n" + "#" * 52)
    print("  LSTM — next-day return → price prediction")
    print("#" * 52)

    model = build_lstm(input_shape=(X_train.shape[1], X_train.shape[2]))
    model.summary()

    model.fit(
        X_train,
        y_train,
        epochs=60,
        batch_size=32,
        validation_data=(X_test, y_test),
        callbacks=get_callbacks(),
        verbose=1,
    )

    # ── Predict & reconstruct prices ──────────────────────────────────────────
    pred_returns = model.predict(X_test, verbose=0).flatten()
    preds_price  = today_closes_test * (1 + pred_returns)
    actual_price = today_closes_test * (1 + y_test)

    # ── Evaluate ──────────────────────────────────────────────────────────────
    preds_price = evaluate_model(preds_price, actual_price, label="LSTM")

    # ── Backtest ──────────────────────────────────────────────────────────────
    df_test_start = WINDOW_SIZE - 1 + split
    df_test = df.iloc[df_test_start : df_test_start + len(y_test)].copy().reset_index(drop=True)
    backtest(df_test, preds_price, label="LSTM")


if __name__ == "__main__":
    main()

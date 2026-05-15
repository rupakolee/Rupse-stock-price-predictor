"""
Stock Price Direction Predictor
================================
Trains two models on historical OHLCV data:
  1. Random Forest  — flat feature vector per day
  2. LSTM           — sliding window of feature sequences

Both models predict: will tomorrow's Close be higher than today's?
"""

import numpy as np
from sklearn.preprocessing import MinMaxScaler

from config import TICKER, TRAIN_SPLIT, WINDOW_SIZE, RF_FEATURES, LSTM_FEATURES
from src.data_loader import load_stock_data
from src.features import create_features
from src.dataset import create_sequences
from src.model import train_model
from src.model_lstm import build_lstm, get_callbacks
from src.evaluate import evaluate_model
from src.backtest import backtest


def run_random_forest(df: "pd.DataFrame") -> None:
    print("\n" + "#" * 50)
    print("  RANDOM FOREST")
    print("#" * 50)

    X = df[RF_FEATURES].values
    y = df["target"].values

    split = int(len(df) * TRAIN_SPLIT)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    model = train_model(X_train, y_train)
    preds = evaluate_model(model, X_test, y_test, label="Random Forest")

    # Align the test slice of df with predictions
    df_test = df.iloc[split:].copy().reset_index(drop=True)
    backtest(df_test, preds, label="Random Forest")


def run_lstm(df: "pd.DataFrame") -> None:
    print("\n" + "#" * 50)
    print("  LSTM")
    print("#" * 50)

    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(df[LSTM_FEATURES].values)
    y = df["target"].values

    X_seq, y_seq = create_sequences(X_scaled, y, window_size=WINDOW_SIZE)

    split = int(len(X_seq) * TRAIN_SPLIT)
    X_train, X_test = X_seq[:split], X_seq[split:]
    y_train, y_test = y_seq[:split], y_seq[split:]

    # Compute class weights to handle imbalance
    n_neg = int((y_train == 0).sum())
    n_pos = int((y_train == 1).sum())
    total = n_neg + n_pos
    class_weight = {0: total / (2 * n_neg), 1: total / (2 * n_pos)}

    model = build_lstm(input_shape=(X_train.shape[1], X_train.shape[2]))
    model.summary()

    model.fit(
        X_train,
        y_train,
        epochs=50,
        batch_size=32,
        validation_data=(X_test, y_test),
        callbacks=get_callbacks(),
        class_weight=class_weight,
        verbose=1,
    )

    preds = evaluate_model(model, X_test, y_test, label="LSTM")

    # The sequence window shifts the index by WINDOW_SIZE rows.
    # X_seq[i] corresponds to df row (WINDOW_SIZE + i).
    # The test slice starts at (WINDOW_SIZE + split).
    df_test_start = WINDOW_SIZE + split
    df_test = df.iloc[df_test_start : df_test_start + len(y_test)].copy().reset_index(drop=True)
    backtest(df_test, preds, label="LSTM")


def main() -> None:
    print(f"Loading data for {TICKER}...")
    df = load_stock_data(TICKER)

    print("Engineering features...")
    df = create_features(df)

    print(f"Dataset size after feature engineering: {len(df)} rows")

    if df.empty:
        raise RuntimeError(
            "No data available after feature engineering. "
            "Check that the download succeeded and the date range is valid."
        )

    run_random_forest(df)
    run_lstm(df)


if __name__ == "__main__":
    main()

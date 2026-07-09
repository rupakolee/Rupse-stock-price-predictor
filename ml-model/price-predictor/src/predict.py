"""Inference entrypoint for the trained LSTM model.

This script loads the saved Keras model, fetches OHLCV history for a ticker,
rebuilds the feature matrix used during training, and returns a JSON payload
with a next-day return forecast plus a small projected path.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics import r2_score
from sklearn.preprocessing import MinMaxScaler

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import LSTM_FEATURES, TRAIN_SPLIT, WINDOW_SIZE  # noqa: E402
from src.data_loader import load_stock_data  # noqa: E402
from src.dataset import create_sequences  # noqa: E402
from src.features import create_features  # noqa: E402


def _print_evaluation(
    actual: np.ndarray,
    predicted: np.ndarray,
    label: str = "Test",
) -> None:
    mae = np.mean(np.abs(predicted - actual))
    rmse = np.sqrt(np.mean((predicted - actual) ** 2))
    mask = actual != 0
    mape = np.mean(np.abs((predicted[mask] - actual[mask]) / actual[mask])) * 100
    r2 = r2_score(actual, predicted)
    actual_dir = np.sign(np.diff(actual, prepend=actual[0]))
    pred_dir = np.sign(predicted - np.roll(actual, 1))
    pred_dir[0] = 0
    dir_acc = np.mean(actual_dir[1:] == pred_dir[1:]) * 100

    msg = (
        f"\n{'='*52}\n"
        f"  {label} Set Evaluation\n"
        f"{'='*52}\n"
        f"  R² score                     : {r2:.4f}\n"
        f"  Price MAE  (mean absolute error): ${mae:.2f}\n"
        f"  Price RMSE (root mean sq error) : ${rmse:.2f}\n"
        f"  Price MAPE (mean abs % error)   : {mape:.2f}%\n"
        f"  Direction accuracy              : {dir_acc:.2f}%\n"
    )
    n_show = min(5, len(actual))
    if n_show > 0:
        msg += f"\n  Last {n_show} predictions vs actuals:\n"
        msg += f"  {'Predicted':>12}  {'Actual':>10}  {'Error':>10}\n"
        for p, a in zip(predicted[-n_show:], actual[-n_show:]):
            msg += f"  ${p:>11.2f}  ${a:>9.2f}  ${p - a:>+9.2f}\n"
    print(msg, file=sys.stderr)


@dataclass
class SessionRow:
    datetime: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    changePct: float


def _to_float(value: object) -> float:
    if value is None:
        return float("nan")
    try:
        return float(value)
    except (TypeError, ValueError):
        return float("nan")


def _format_date(date_value: pd.Timestamp) -> str:
    return pd.Timestamp(date_value).to_pydatetime().date().isoformat()


def _next_business_day(start_date: pd.Timestamp, trading_days_ahead: int) -> pd.Timestamp:
    next_date = pd.Timestamp(start_date)
    added = 0

    while added < trading_days_ahead:
        next_date += pd.Timedelta(days=1)
        if next_date.dayofweek < 5:
            added += 1

    return next_date


def _average(values: np.ndarray) -> float:
    return float(np.mean(values)) if len(values) else float("nan")


def _std(values: np.ndarray) -> float:
    return float(np.std(values, ddof=1)) if len(values) > 1 else 0.0


def _calculate_max_drawdown(closes: np.ndarray) -> float:
    if len(closes) < 2:
        return float("nan")

    peak = closes[0]
    max_drawdown = 0.0

    for close in closes:
        if close > peak:
            peak = close
        drawdown = ((close - peak) / peak) * 100
        if drawdown < max_drawdown:
            max_drawdown = drawdown

    return float(max_drawdown)


def build_payload(symbol: str, horizon: int) -> dict:
    model_path = ROOT / "best_model.keras"
    if not model_path.exists():
        raise RuntimeError(f"Model file not found: {model_path}")

    model = tf.keras.models.load_model(model_path, compile=False)

    raw = load_stock_data(symbol)
    features = create_features(raw)
    if len(features) < WINDOW_SIZE:
        raise RuntimeError(f"Not enough data to build a {WINDOW_SIZE}-day prediction window")

    # Raw data may have one more row than features (last row dropped by
    # create_features because next_return needs tomorrow's close).  Save
    # the most recent actual trading session for currentPrice / latestDate.
    raw_last_row = raw.iloc[-1]
    raw_last_close = float(raw_last_row["Close"])
    raw_last_date = pd.Timestamp(raw_last_row["Date"])
    raw_data = raw  # keep a reference for stats below

    closes_all = features["Close"].astype(float).to_numpy()
    dates_all = features["Date"].astype(str).to_numpy()

    feat_scaler = MinMaxScaler()
    X_scaled = feat_scaler.fit_transform(features[LSTM_FEATURES].values)
    y_raw = features["next_return"].values

    X_seq, y_seq = create_sequences(X_scaled, y_raw, window_size=WINDOW_SIZE)

    split = int(len(X_seq) * TRAIN_SPLIT)
    X_train, X_test = X_seq[:split], X_seq[split:]
    y_train, y_test = y_seq[:split], y_seq[split:]

    seq_starts_at = WINDOW_SIZE
    train_start = seq_starts_at
    train_end = seq_starts_at + split
    train_actual_prices = closes_all[train_start:train_end]
    train_actual_dates = dates_all[train_start:train_end]

    # ── Predict on training set ────────────────────────────────────────────
    train_returns = model.predict(X_train, verbose=0).flatten()

    n_train = len(y_train)
    today_closes_train = closes_all[train_start:train_start + n_train]
    next_start_train = train_start + 1
    train_actual_prices_full = closes_all[next_start_train:next_start_train + n_train]
    train_predicted_prices_full = today_closes_train * (1 + train_returns)

    _print_evaluation(train_actual_prices_full, train_predicted_prices_full, label="Train")

    test_returns = model.predict(X_test, verbose=0).flatten()

    n_test = len(y_test)
    today_closes_test = closes_all[train_end : train_end + n_test]
    next_start = train_end + 1

    next_close_actual = closes_all[next_start : next_start + n_test]
    test_actual_dates = dates_all[next_start : next_start + n_test]

    n_actual = len(next_close_actual)
    test_actual_prices = next_close_actual
    test_predicted_prices = today_closes_test[:n_actual] * (1 + test_returns[:n_actual])

    _print_evaluation(test_actual_prices, test_predicted_prices, label="Test")

    test_r2 = r2_score(test_actual_prices, test_predicted_prices) if n_actual > 1 else 0.0

    sample = X_scaled[-WINDOW_SIZE:]

    predicted_return = float(model.predict(sample[None, ...], verbose=0).flatten()[0])

    predicted_next_close = float(closes_all[-1] * (1 + predicted_return))
    print(
        f"\n{'='*52}\n"
        f"  Next-Day Prediction\n"
        f"{'='*52}\n"
        f"  Symbol          : {symbol}\n"
        f"  Last close      : ${closes_all[-1]:.2f}\n"
        f"  Predicted close : ${predicted_next_close:.2f}\n"
        f"  Expected return : {predicted_return:+.4%}\n"
        f"  Expected move   : {((predicted_next_close / closes_all[-1]) - 1) * 100:+.2f}%\n",
        file=sys.stderr,
    )

    # Extend chart arrays with the most recent trading session
    # (was dropped from features by next_return's shift(-1) + dropna).
    _raw_last_str = _format_date(raw_last_date)
    _predicted_last_close = float(closes_all[-1] * (1 + predicted_return))
    test_actual_dates_ext = list(test_actual_dates) + [_raw_last_str]
    test_actual_prices_ext = list(test_actual_prices) + [raw_last_close]
    predicted_dates_ext = list(test_actual_dates) + [_raw_last_str]
    predicted_prices_ext = list(test_predicted_prices) + [_predicted_last_close]

    recent_raw = raw_data.tail(min(90, len(raw_data))).copy()
    closes = recent_raw["Close"].astype(float).to_numpy()
    returns = np.diff(closes) / closes[:-1] if len(closes) > 1 else np.array([])

    current_price = raw_last_close
    mean_return = _average(returns) if len(returns) else 0.0
    volatility = _std(returns)
    moving_average_20 = float(recent_raw["Close"].tail(20).mean())
    moving_average_50 = float(recent_raw["Close"].tail(50).mean())
    momentum = ((current_price - moving_average_20) / moving_average_20) * 100 if moving_average_20 else 0.0
    trend_score = momentum + (((moving_average_20 - moving_average_50) / moving_average_50) * 100 if moving_average_50 else 0.0)
    total_return = ((current_price - float(closes[0])) / float(closes[0])) * 100 if len(closes) > 1 else 0.0

    base_growth = 1 + predicted_return
    bullish_growth = 1 + predicted_return + volatility * 0.45
    bearish_growth = max(0.01, 1 + predicted_return - volatility * 0.45)

    last_date = raw_last_date

    points = []
    for step in range(1, horizon + 1):
        next_day = _next_business_day(last_date, step)
        points.append(
            {
                "day": next_day.strftime("%b %d"),
                "projected": float(current_price * math.pow(base_growth, step)),
                "bullish": float(current_price * math.pow(bullish_growth, step)),
                "bearish": float(current_price * math.pow(bearish_growth, step)),
            }
        )

    next_close = points[0]["projected"] if points else current_price
    expected_move = ((next_close - current_price) / current_price) * 100
    horizon_return = ((points[-1]["projected"] - current_price) / current_price) * 100 if points else 0.0
    confidence_low = points[-1]["bearish"] if points else current_price
    confidence_high = points[-1]["bullish"] if points else current_price
    confidence_spread = ((confidence_high - confidence_low) / current_price) * 100 if current_price else 0.0

    trend_bias = "Bullish" if trend_score > 1 else "Bearish" if trend_score < -1 else "Neutral"
    trend_tone = "text-emerald-400" if trend_score > 1 else "text-rose-400" if trend_score < -1 else "text-muted-foreground"

    recent_sessions = []
    for _, row in raw_data.tail(5).iloc[::-1].iterrows():
        open_price = _to_float(row["Open"])
        close_price = _to_float(row["Close"])
        change_pct = ((close_price - open_price) / open_price) * 100 if open_price else 0.0
        recent_sessions.append(
            asdict(
                SessionRow(
                    datetime=_format_date(pd.Timestamp(row["Date"])),
                    open=open_price,
                    high=_to_float(row["High"]),
                    low=_to_float(row["Low"]),
                    close=close_price,
                    volume=_to_float(row["Volume"]),
                    changePct=change_pct,
                )
            )
        )

    return {
        "symbol": symbol,
        "currentPrice": current_price,
        "nextClose": next_close,
        "expectedMove": expected_move,
        "horizonReturn": horizon_return,
        "confidenceLow": confidence_low,
        "confidenceHigh": confidence_high,
        "confidenceSpread": confidence_spread,
        "bias": trend_bias,
        "biasTone": trend_tone,
        "trendScore": trend_score,
        "totalReturn": total_return,
        "volatility": volatility,
        "meanReturn": mean_return,
        "momentum": momentum,
        "movingAverage20": moving_average_20,
        "movingAverage50": moving_average_50,
        "latestDate": _format_date(last_date),
        "recentCount": int(len(recent_raw)),
        "horizonDays": horizon,
        "points": points,
        "recentSessions": recent_sessions,
        "trainDates": train_actual_dates.tolist(),
        "trainPrices": train_actual_prices.tolist(),
        "testDates": test_actual_dates_ext,
        "testPrices": test_actual_prices_ext,
        "predictedDates": predicted_dates_ext,
        "predictedPrices": predicted_prices_ext,
        "metrics": {
            "r2": test_r2,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol", required=True)
    parser.add_argument("--horizon", type=int, default=5)
    args = parser.parse_args()

    symbol = args.symbol.strip().upper()
    horizon = max(1, min(int(args.horizon), 30))

    try:
        payload = build_payload(symbol, horizon)
        print(json.dumps(payload))
        return 0
    except Exception as exc:  # pragma: no cover - surfaced through backend
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
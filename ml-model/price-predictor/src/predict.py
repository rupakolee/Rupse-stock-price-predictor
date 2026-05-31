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
from sklearn.preprocessing import MinMaxScaler

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import LSTM_FEATURES, WINDOW_SIZE  # noqa: E402
from src.data_loader import load_stock_data  # noqa: E402
from src.features import create_features  # noqa: E402


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

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(features[LSTM_FEATURES].values)
    sample = scaled[-WINDOW_SIZE:]

    predicted_return = float(model.predict(sample[None, ...], verbose=0).flatten()[0])

    recent = features.tail(min(90, len(features))).copy()
    closes = recent["Close"].astype(float).to_numpy()
    returns = np.diff(closes) / closes[:-1] if len(closes) > 1 else np.array([])

    current_price = float(closes[-1])
    mean_return = _average(returns) if len(returns) else 0.0
    volatility = _std(returns)
    moving_average_20 = float(recent["Close"].tail(20).mean())
    moving_average_50 = float(recent["Close"].tail(50).mean())
    momentum = ((current_price - moving_average_20) / moving_average_20) * 100 if moving_average_20 else 0.0
    trend_score = momentum + (((moving_average_20 - moving_average_50) / moving_average_50) * 100 if moving_average_50 else 0.0)
    total_return = ((current_price - float(closes[0])) / float(closes[0])) * 100 if len(closes) > 1 else 0.0

    base_growth = 1 + predicted_return
    bullish_growth = 1 + predicted_return + volatility * 0.45
    bearish_growth = max(0.01, 1 + predicted_return - volatility * 0.45)

    last_row = recent.iloc[-1]
    last_date = pd.Timestamp(last_row["Date"])

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
    for _, row in recent.tail(5).iloc[::-1].iterrows():
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
        "recentCount": int(len(recent)),
        "horizonDays": horizon,
        "points": points,
        "recentSessions": recent_sessions,
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
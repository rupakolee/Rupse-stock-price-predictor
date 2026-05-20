import pandas as pd
import numpy as np


def _rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """Relative Strength Index."""
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(com=period - 1, min_periods=period).mean()
    avg_loss = loss.ewm(com=period - 1, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    return 100 - (100 / (1 + rs))


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineer features from raw OHLCV data.

    Features
    --------
    Trend / momentum
      close_scaled  : Close / MA50  — price relative to medium-term trend
      return        : daily % return
      return_lag1-3 : lagged returns (1, 2, 3 days)
      ma_ratio_10   : Close / MA10  — distance from short-term MA
      ma_ratio_50   : Close / MA50  — distance from medium-term MA
      volatility    : 10-day rolling std of return
      rsi           : 14-day RSI (0-100)
      macd          : (EMA12 - EMA26) / Close  — normalised MACD line
      macd_signal   : 9-day EMA of macd

    Volume
      volume_ratio  : Volume / Volume.rolling(20).mean()
      obv_ratio     : OBV / OBV.rolling(20).mean()  — volume trend

    Cyclical time
      dow_sin / dow_cos : day-of-week encoded as sin/cos (captures weekly seasonality)

    Target
    ------
    next_return   : tomorrow's % return  (what the model predicts)
    next_close    : tomorrow's actual Close price  (for evaluation / backtest)
    """
    df = df.copy()

    close  = df["Close"].squeeze()
    volume = df["Volume"].squeeze()

    # ── Returns ───────────────────────────────────────────────────────────────
    ret = close.pct_change()
    df["return"]      = ret
    df["return_lag1"] = ret.shift(1)
    df["return_lag2"] = ret.shift(2)
    df["return_lag3"] = ret.shift(3)

    # ── Price relative to moving averages ─────────────────────────────────────
    ma10 = close.rolling(10).mean()
    ma50 = close.rolling(50).mean()
    df["close_scaled"] = close / ma50
    df["ma_ratio_10"]  = close / ma10
    df["ma_ratio_50"]  = close / ma50

    # ── Volatility ────────────────────────────────────────────────────────────
    df["volatility"] = ret.rolling(10).std()

    # ── RSI ───────────────────────────────────────────────────────────────────
    df["rsi"] = _rsi(close)

    # ── MACD (normalised by Close so it's scale-invariant) ────────────────────
    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    df["macd"]        = (ema12 - ema26) / close
    df["macd_signal"] = df["macd"].ewm(span=9, adjust=False).mean()

    # ── Volume ────────────────────────────────────────────────────────────────
    df["volume_ratio"] = volume / volume.rolling(20).mean()

    # ── On-Balance Volume ratio ───────────────────────────────────────────────
    obv = (np.sign(ret) * volume).fillna(0).cumsum()
    obv_ma = obv.rolling(20).mean().replace(0, np.nan)
    df["obv_ratio"] = obv / obv_ma

    # ── Cyclical day-of-week encoding ─────────────────────────────────────────
    if "Date" in df.columns:
        dow = pd.to_datetime(df["Date"]).dt.dayofweek  # 0=Mon … 4=Fri
    else:
        dow = df.index.dayofweek
    df["dow_sin"] = np.sin(2 * np.pi * dow / 5)
    df["dow_cos"] = np.cos(2 * np.pi * dow / 5)

    # ── Targets ───────────────────────────────────────────────────────────────
    df["next_return"] = close.pct_change().shift(-1)
    df["next_close"]  = close.shift(-1)

    df = df.dropna()
    df = df.reset_index(drop=True)
    return df

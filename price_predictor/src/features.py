import pandas as pd
import numpy as np


def _rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """Relative Strength Index — computed without external dependencies."""
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

    Added features
    --------------
    return      : daily log return
    ma_10       : 10-day simple moving average of Close
    ma_50       : 50-day simple moving average of Close
    volatility  : 10-day rolling std of daily return
    rsi         : 14-day RSI
    macd        : MACD line  (EMA12 - EMA26)
    macd_signal : 9-day EMA of MACD line

    target      : 1 if next-day Close > today's Close, else 0
    """
    df = df.copy()

    close = df["Close"].squeeze()  # guard against accidental Series-of-Series

    df["return"] = close.pct_change()
    df["ma_10"] = close.rolling(10).mean()
    df["ma_50"] = close.rolling(50).mean()
    df["volatility"] = df["return"].rolling(10).std()

    df["rsi"] = _rsi(close)

    ema12 = close.ewm(span=12, adjust=False).mean()
    ema26 = close.ewm(span=26, adjust=False).mean()
    df["macd"] = ema12 - ema26
    df["macd_signal"] = df["macd"].ewm(span=9, adjust=False).mean()

    df["target"] = (close.shift(-1) > close).astype(int)

    df = df.dropna()
    df = df.reset_index(drop=True)
    return df

TICKER = "AAPL"

# Number of recent trading days to fetch on the very first run.
# Must be large enough for the model: at least WINDOW_SIZE + 50 (for MA50)
# plus a small buffer for lag features.  150 is a safe default.
INITIAL_LOOKBACK_DAYS = 150

TRAIN_SPLIT = 0.8
WINDOW_SIZE = 90

LSTM_FEATURES = [
    # Trend / price level
    "close_scaled",
    # Returns
    "return", "return_lag1", "return_lag2", "return_lag3",
    # Moving average ratios
    "ma_ratio_10", "ma_ratio_50",
    # Volatility
    "volatility",
    # Momentum oscillators
    "rsi",
    "macd", "macd_signal",
    # Volume
    "volume_ratio",
    "obv_ratio",
    # Cyclical time
    "dow_sin", "dow_cos",
]

# The model predicts next_return; next_close is used only for evaluation
TARGET = "next_return"

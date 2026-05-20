TICKER = "AAPL"
START_DATE = "2018-01-01"

TRAIN_SPLIT = 0.8
WINDOW_SIZE = 60

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

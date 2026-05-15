TICKER = "AAPL"
START_DATE = "2015-01-01"

TRAIN_SPLIT = 0.8
WINDOW_SIZE = 50

# Features used by the Random Forest model (flat, no sequences)
RF_FEATURES = ["return", "ma_10", "ma_50", "volatility", "rsi", "macd", "macd_signal"]

# Features used by the LSTM model (same set, but shaped into sequences)
LSTM_FEATURES = ["return", "ma_10", "ma_50", "volatility", "rsi", "macd", "macd_signal"]

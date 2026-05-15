from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization, Input
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam


def build_lstm(input_shape: tuple) -> Sequential:
    """
    Build a stacked LSTM for binary direction classification.

    Parameters
    ----------
    input_shape : (window_size, n_features)

    Returns
    -------
    Compiled Keras Sequential model.
    """
    model = Sequential(
        [
            Input(shape=input_shape),
            LSTM(128, return_sequences=True),
            BatchNormalization(),
            Dropout(0.3),

            LSTM(64, return_sequences=True),
            BatchNormalization(),
            Dropout(0.3),

            LSTM(32),
            BatchNormalization(),
            Dropout(0.2),

            Dense(16, activation="relu"),
            Dense(1, activation="sigmoid"),
        ]
    )

    model.compile(
        optimizer=Adam(learning_rate=1e-3),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )
    return model


def get_callbacks() -> list:
    """Standard callbacks: early stopping + learning-rate reduction."""
    return [
        EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6),
    ]

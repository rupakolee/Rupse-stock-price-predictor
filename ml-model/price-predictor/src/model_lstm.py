import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    LSTM, Dense, Dropout, BatchNormalization,
    Input, Bidirectional, Add, Activation,
)
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2


def build_lstm(input_shape: tuple) -> Model:
    """
    Stacked Bidirectional LSTM for next-day return regression.

    Architecture highlights
    -----------------------
    - Bidirectional LSTMs: each layer sees the sequence in both directions,
      giving richer context without extra data.
    - Residual dense connection: helps gradients flow and lets the model
      learn corrections on top of a baseline representation.
    - BatchNorm after each LSTM: stabilises training and acts as regulariser.
    - Huber loss: robust to outlier days (earnings, crashes).
    - Linear output: predicts a % return (can be negative).

    Parameters
    ----------
    input_shape : (window_size, n_features)
    """
    reg = l2(1e-4)
    inputs = Input(shape=input_shape)

    # ── Layer 1: Bidirectional LSTM ───────────────────────────────────────────
    x = Bidirectional(LSTM(128, return_sequences=True, kernel_regularizer=reg))(inputs)
    x = BatchNormalization()(x)
    x = Dropout(0.3)(x)

    # ── Layer 2: Bidirectional LSTM ───────────────────────────────────────────
    x = Bidirectional(LSTM(64, return_sequences=True, kernel_regularizer=reg))(x)
    x = BatchNormalization()(x)
    x = Dropout(0.3)(x)

    # ── Layer 3: LSTM (collapses sequence → single vector) ────────────────────
    x = LSTM(64, return_sequences=False, kernel_regularizer=reg)(x)
    x = BatchNormalization()(x)
    x = Dropout(0.2)(x)

    # ── Dense head with residual connection ───────────────────────────────────
    # Branch A: direct projection
    shortcut = Dense(32, kernel_regularizer=reg)(x)

    # Branch B: non-linear transformation
    h = Dense(64, activation="relu", kernel_regularizer=reg)(x)
    h = Dropout(0.2)(h)
    h = Dense(32, kernel_regularizer=reg)(h)

    # Residual add + activation
    x = Add()([shortcut, h])
    x = Activation("relu")(x)
    x = BatchNormalization()(x)

    # ── Output: linear (% return can be negative) ─────────────────────────────
    output = Dense(1, activation="linear")(x)

    model = Model(inputs=inputs, outputs=output)
    model.compile(
        optimizer=Adam(learning_rate=1e-3),
        loss="huber",
        metrics=["mae"],
    )
    return model


def get_callbacks(checkpoint_path: str = "best_model.keras") -> list:
    """
    Training callbacks:
    - EarlyStopping: stops when val_loss stops improving (patience=20)
    - ReduceLROnPlateau: halves LR when val_loss plateaus (patience=8)
    - ModelCheckpoint: saves the best weights automatically
    """
    return [
        EarlyStopping(
            monitor="val_loss",
            patience=20,
            restore_best_weights=True,
            verbose=1,
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=8,
            min_lr=1e-6,
            verbose=1,
        ),
        ModelCheckpoint(
            filepath=checkpoint_path,
            monitor="val_loss",
            save_best_only=True,
            verbose=0,
        ),
    ]

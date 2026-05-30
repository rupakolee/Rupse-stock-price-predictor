import numpy as np


def create_sequences(
    data: np.ndarray,
    target: np.ndarray,
    window_size: int = 50,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Slide a window over `data` to produce (X, y) pairs for sequence models.

    Parameters
    ----------
    data        : 2-D array of shape (n_samples, n_features)
    target      : 1-D array of shape (n_samples,)
    window_size : number of time steps per sample

    Returns
    -------
    X : shape (n_samples - window_size, window_size, n_features)
    y : shape (n_samples - window_size,)
    """
    X, y = [], []
    for i in range(window_size, len(data)):
        X.append(data[i - window_size : i])
        y.append(target[i])
    return np.array(X), np.array(y)

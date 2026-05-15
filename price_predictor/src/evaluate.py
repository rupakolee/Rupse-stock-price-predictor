import numpy as np
from sklearn.metrics import accuracy_score, classification_report


def evaluate_model(
    model,
    X_test: np.ndarray,
    y_test: np.ndarray,
    threshold: float = 0.5,
    label: str = "Model",
) -> np.ndarray:
    """
    Evaluate a classifier and print a summary report.

    Works for both sklearn models (predict returns class labels) and
    Keras models (predict returns probabilities).

    Parameters
    ----------
    model     : fitted sklearn or Keras model
    X_test    : test features
    y_test    : true labels
    threshold : probability cut-off for Keras sigmoid output
    label     : display name printed in the header

    Returns
    -------
    preds : 1-D integer array of predicted class labels
    """
    raw = model.predict(X_test)

    # Keras returns a 2-D probability array; sklearn returns class labels directly
    if raw.ndim == 2 or (raw.ndim == 1 and raw.dtype == float and raw.max() <= 1.0):
        preds = (raw.flatten() >= threshold).astype(int)
    else:
        preds = raw.astype(int).flatten()

    print(f"\n{'='*50}")
    print(f"  {label} Evaluation")
    print(f"{'='*50}")
    print(f"Accuracy : {accuracy_score(y_test, preds):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, preds, target_names=["Down", "Up"], zero_division=0))

    return preds

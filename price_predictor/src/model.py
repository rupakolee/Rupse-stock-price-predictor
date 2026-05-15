from sklearn.ensemble import RandomForestClassifier
import numpy as np


def train_model(X_train: np.ndarray, y_train: np.ndarray) -> RandomForestClassifier:
    """Train a Random Forest classifier for next-day direction prediction."""
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=6,
        min_samples_leaf=5,
        class_weight="balanced",   # handles class imbalance gracefully
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    return model

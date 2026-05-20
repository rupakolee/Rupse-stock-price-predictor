import numpy as np


def evaluate_model(
    preds_price: np.ndarray,   # predicted next-day closing prices (dollars)
    actual_price: np.ndarray,  # actual next-day closing prices (dollars)
    label: str = "Model",
) -> np.ndarray:
    """
    Evaluate price predictions and report error metrics in dollar terms.

    Parameters
    ----------
    preds_price  : 1-D array of predicted next-day closing prices
    actual_price : 1-D array of actual next-day closing prices
    label        : display name

    Returns
    -------
    preds_price : same array passed in (for chaining)
    """
    preds_price  = np.asarray(preds_price).flatten()
    actual_price = np.asarray(actual_price).flatten()

    mae  = np.mean(np.abs(preds_price - actual_price))
    rmse = np.sqrt(np.mean((preds_price - actual_price) ** 2))
    mask = actual_price != 0
    mape = np.mean(np.abs((preds_price[mask] - actual_price[mask]) / actual_price[mask])) * 100

    # Direction accuracy: did the model predict the correct sign of the move?
    # Compare predicted next-day price vs the current day's close (shifted actual)
    actual_direction = np.sign(np.diff(actual_price, prepend=actual_price[0]))
    pred_direction   = np.sign(preds_price - np.roll(actual_price, 1))
    pred_direction[0] = 0  # first element has no prior reference
    dir_acc = np.mean(actual_direction[1:] == pred_direction[1:]) * 100

    print(f"\n{'='*52}")
    print(f"  {label} Evaluation")
    print(f"{'='*52}")
    print(f"  Price MAE  (mean absolute error): ${mae:.2f}")
    print(f"  Price RMSE (root mean sq error) : ${rmse:.2f}")
    print(f"  Price MAPE (mean abs % error)   : {mape:.2f}%")
    print(f"  Direction accuracy              : {dir_acc:.2f}%")
    print(f"\n  Last 5 predictions vs actuals:")
    print(f"  {'Predicted':>12}  {'Actual':>10}  {'Error':>10}")
    for p, a in zip(preds_price[-5:], actual_price[-5:]):
        print(f"  ${p:>11.2f}  ${a:>9.2f}  ${p - a:>+9.2f}")

    return preds_price

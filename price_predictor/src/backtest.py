import pandas as pd
import numpy as np


def backtest(
    df: pd.DataFrame,
    preds: np.ndarray,
    label: str = "Strategy",
) -> pd.DataFrame:
    """
    Simple long-only backtest: go long when the model predicts UP (1),
    stay flat otherwise.

    Parameters
    ----------
    df    : feature DataFrame aligned to the predictions (same length as preds)
    preds : 1-D integer array of predicted labels (0 = Down, 1 = Up)
    label : display name for the printed summary

    Returns
    -------
    result_df : DataFrame with columns [return, pred, strategy_return, cum_market, cum_strategy]
    """
    result = df[["return"]].copy().reset_index(drop=True)
    result["pred"] = preds

    # Long when pred == 1, flat otherwise
    result["strategy_return"] = result["return"] * result["pred"]

    result["cum_market"] = (1 + result["return"]).cumprod() - 1
    result["cum_strategy"] = (1 + result["strategy_return"]).cumprod() - 1

    total_market = result["cum_market"].iloc[-1]
    total_strategy = result["cum_strategy"].iloc[-1]

    # Annualised Sharpe (252 trading days, risk-free ≈ 0)
    daily_excess = result["strategy_return"]
    sharpe = (
        (daily_excess.mean() / daily_excess.std()) * np.sqrt(252)
        if daily_excess.std() > 0
        else 0.0
    )

    # Max drawdown
    cum = (1 + result["strategy_return"]).cumprod()
    rolling_max = cum.cummax()
    drawdown = (cum - rolling_max) / rolling_max
    max_dd = drawdown.min()

    print(f"\n{'='*50}")
    print(f"  {label} Backtest Results")
    print(f"{'='*50}")
    print(f"Market  cumulative return : {total_market:+.2%}")
    print(f"Strategy cumulative return: {total_strategy:+.2%}")
    print(f"Annualised Sharpe ratio   : {sharpe:.2f}")
    print(f"Max drawdown              : {max_dd:.2%}")
    print(f"Win rate                  : {(result['strategy_return'] > 0).mean():.2%}")

    return result

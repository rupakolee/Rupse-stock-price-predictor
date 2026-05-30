import pandas as pd
import numpy as np


def backtest(
    df: pd.DataFrame,
    preds_price: np.ndarray,
    label: str = "Strategy",
) -> pd.DataFrame:
    """
    Price-prediction backtest: go long when the model predicts tomorrow's
    price will be higher than today's Close, stay flat otherwise.

    Parameters
    ----------
    df           : feature DataFrame aligned to the predictions (same length)
                   Must contain a 'Close' and a 'return' column.
    preds_price  : 1-D array of predicted next-day Close prices (real $)
    label        : display name for the printed summary

    Returns
    -------
    result_df : DataFrame with strategy and market return columns
    """
    result = df[["Close", "return"]].copy().reset_index(drop=True)
    result["pred_price"] = preds_price

    # Signal: go long if predicted next-day price > today's close
    result["signal"] = (result["pred_price"] > result["Close"]).astype(int)

    # Strategy return = today's actual return * yesterday's signal
    # (signal is formed at end-of-day t, applied to return on day t+1)
    result["strategy_return"] = result["return"] * result["signal"].shift(1).fillna(0)

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

    # Direction accuracy: did the model correctly predict up vs down?
    actual_direction = (result["return"] > 0).astype(int)
    pred_direction = result["signal"]
    dir_accuracy = (actual_direction == pred_direction).mean()

    print(f"\n{'='*50}")
    print(f"  {label} Backtest Results")
    print(f"{'='*50}")
    print(f"  Market   cumulative return : {total_market:+.2%}")
    print(f"  Strategy cumulative return : {total_strategy:+.2%}")
    print(f"  Annualised Sharpe ratio    : {sharpe:.2f}")
    print(f"  Max drawdown               : {max_dd:.2%}")
    print(f"  Direction accuracy         : {dir_accuracy:.2%}")
    print(f"  Win rate (profitable days) : {(result['strategy_return'] > 0).mean():.2%}")

    return result

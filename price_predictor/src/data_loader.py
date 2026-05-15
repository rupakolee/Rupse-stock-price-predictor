import time
import pathlib
import pandas as pd
import yfinance as yf
from config import START_DATE

# Cache directory — sits next to src/
_CACHE_DIR = pathlib.Path(__file__).parent.parent / "data"
_CACHE_DIR.mkdir(exist_ok=True)

# Columns we actually need; extras like Dividends / Stock Splits are dropped
_OHLCV_COLS = ["Date", "Open", "High", "Low", "Close", "Volume"]


def _download(ticker: str) -> pd.DataFrame:
    """
    Use Ticker.history() — more reliable than yf.download() under rate limits.
    Falls back to yf.download() if history() returns nothing.
    """
    t = yf.Ticker(ticker)
    df = t.history(start=START_DATE, auto_adjust=True)

    if df.empty:
        # fallback
        df = yf.download(ticker, start=START_DATE, auto_adjust=True, progress=False)

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()
    df.columns = [str(c) for c in df.columns]

    # Normalise the date column name (history() sometimes returns 'Datetime')
    if "Datetime" in df.columns:
        df = df.rename(columns={"Datetime": "Date"})

    # Strip timezone info from the Date column so CSV round-trips cleanly
    if pd.api.types.is_datetime64tz_dtype(df["Date"]):
        df["Date"] = df["Date"].dt.tz_localize(None)

    # Keep only OHLCV columns that exist
    keep = [c for c in _OHLCV_COLS if c in df.columns]
    df = df[keep]

    return df


def load_stock_data(
    ticker: str,
    max_retries: int = 3,
    retry_delay: float = 15.0,
) -> pd.DataFrame:
    """
    Load OHLCV data for `ticker` from local cache or Yahoo Finance.

    Cache file: data/<TICKER>_<START_DATE>.csv
    Delete the file to force a fresh download.
    """
    cache_file = _CACHE_DIR / f"{ticker}_{START_DATE}.csv"

    # ── 1. Return cached data if available ──────────────────────────────────
    if cache_file.exists():
        print(f"[data_loader] Loading cached data from {cache_file}")
        df = pd.read_csv(cache_file, parse_dates=["Date"])
        return df

    # ── 2. Download with retry logic ─────────────────────────────────────────
    df = pd.DataFrame()
    for attempt in range(1, max_retries + 1):
        print(f"[data_loader] Downloading {ticker} (attempt {attempt}/{max_retries})...")
        try:
            df = _download(ticker)
            if not df.empty:
                break
            print(f"[data_loader] Empty response on attempt {attempt}.")
        except Exception as exc:
            print(f"[data_loader] Error on attempt {attempt}: {exc}")

        if attempt < max_retries:
            print(f"[data_loader] Waiting {retry_delay}s before retry...")
            time.sleep(retry_delay)

    # ── 3. Cache to disk if we got data ──────────────────────────────────────
    if not df.empty:
        df.to_csv(cache_file, index=False)
        print(f"[data_loader] Saved to cache: {cache_file}")
    else:
        raise RuntimeError(
            f"Could not download data for '{ticker}' after {max_retries} attempts.\n"
            f"You can also place a CSV manually at:\n  {cache_file}\n"
            f"Expected columns: Date, Open, High, Low, Close, Volume"
        )

    return df

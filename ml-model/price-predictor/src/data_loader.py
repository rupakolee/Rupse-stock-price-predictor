import time
import pathlib
import sys
from datetime import datetime, timedelta

import pandas as pd
import yfinance as yf
from config import INITIAL_LOOKBACK_DAYS

# Cache directory — sits next to src/
_CACHE_DIR = pathlib.Path(__file__).parent.parent / "data"
_CACHE_DIR.mkdir(exist_ok=True)

# Columns we actually need; extras like Dividends / Stock Splits are dropped
_OHLCV_COLS = ["Date", "Open", "High", "Low", "Close", "Volume"]


def _normalise_df(df: pd.DataFrame) -> pd.DataFrame:
    """Standardise columns coming from different yfinance versions."""
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()
    df.columns = [str(c) for c in df.columns]

    if "Datetime" in df.columns:
        df = df.rename(columns={"Datetime": "Date"})

    if pd.api.types.is_datetime64tz_dtype(df["Date"]):
        df["Date"] = df["Date"].dt.tz_localize(None)

    keep = [c for c in _OHLCV_COLS if c in df.columns]
    df = df[keep]
    return df


def _download_range(ticker: str, start: str, end: str | None = None) -> pd.DataFrame:
    """
    Download OHLCV for `ticker` between `start` and `end` dates.
    Uses Ticker.history() which is more reliable under rate limits.
    """
    t = yf.Ticker(ticker)
    kwargs: dict = {"start": start, "auto_adjust": True}
    if end:
        kwargs["end"] = end
    df = t.history(**kwargs)

    if df.empty:
        kwargs.pop("auto_adjust")
        df = yf.download(ticker, start=start, end=end, auto_adjust=True, progress=False)

    return _normalise_df(df)


def _download_period(ticker: str, period: str = "60d") -> pd.DataFrame:
    """
    Download OHLCV for `ticker` using a relative period (e.g. '60d').
    """
    t = yf.Ticker(ticker)
    df = t.history(period=period, auto_adjust=True)

    if df.empty:
        df = yf.download(ticker, period=period, auto_adjust=True, progress=False)

    return _normalise_df(df)


def _with_retries(fn, max_retries: int = 3, retry_delay: float = 15.0):
    """Call *fn* up to *max_retries* times, sleeping between failures."""
    for attempt in range(1, max_retries + 1):
        try:
            result = fn()
            if isinstance(result, pd.DataFrame) and not result.empty:
                return result
            print(f"[data_loader] Empty response on attempt {attempt}.", file=sys.stderr)
        except Exception as exc:
            print(f"[data_loader] Error on attempt {attempt}: {exc}", file=sys.stderr)

        if attempt < max_retries:
            print(f"[data_loader] Waiting {retry_delay}s before retry...", file=sys.stderr)
            time.sleep(retry_delay)

    return pd.DataFrame()


def _read_cache(cache_file: pathlib.Path) -> pd.DataFrame:
    """Read the CSV cache and normalise dates."""
    df = pd.read_csv(cache_file)
    df["Date"] = pd.to_datetime(df["Date"], utc=True).dt.tz_localize(None)
    keep = [c for c in _OHLCV_COLS if c in df.columns]
    df = df[keep]
    return df


def load_stock_data(
    ticker: str,
    max_retries: int = 3,
    retry_delay: float = 15.0,
) -> pd.DataFrame:
    """
    Load OHLCV data for *ticker*, incrementally maintaining a local CSV cache.

    Behaviour
    ---------
    1. **No cache file yet** — download the most recent
       ``INITIAL_LOOKBACK_DAYS`` trading days and save to disk.
    2. **Cache file exists** — read the last date, then fetch only the new rows
       from that date to today and **append** them to the CSV.
    3. The file grows over time; no historical data is re-downloaded.

    Cache file: ``data/<TICKER>.csv``
    """
    cache_file = _CACHE_DIR / f"{ticker}.csv"

    # ── 1. Cache exists → incremental update ─────────────────────────────────
    if cache_file.exists():
        print(f"[data_loader] Cache found: {cache_file}", file=sys.stderr)
        cached = _read_cache(cache_file)
        last_date = cached["Date"].max()
        today = pd.Timestamp(datetime.now().date())

        if last_date.date() >= today.date():
            print("[data_loader] Cache is up to date.", file=sys.stderr)
            return cached

        # Fetch new rows from the day after the last cached date
        fetch_start = (last_date + timedelta(days=1)).strftime("%Y-%m-%d")
        print(f"[data_loader] Appending data from {fetch_start} …", file=sys.stderr)

        new_data = _with_retries(
            lambda: _download_range(ticker, start=fetch_start),
            max_retries=max_retries,
            retry_delay=retry_delay,
        )

        if new_data.empty:
            print("[data_loader] No new data — returning cached.", file=sys.stderr)
            return cached

        combined = pd.concat([cached, new_data], ignore_index=True)
        combined.drop_duplicates(subset=["Date"], keep="last", inplace=True)
        combined.sort_values("Date", inplace=True)
        combined.reset_index(drop=True, inplace=True)
        combined.to_csv(cache_file, index=False)
        print(
            f"[data_loader] Appended {len(new_data)} rows → {cache_file}",
            file=sys.stderr,
        )
        return combined

    # ── 2. First run → fetch initial lookback window ─────────────────────────
    print(
        f"[data_loader] No cache — downloading last {INITIAL_LOOKBACK_DAYS} days …",
        file=sys.stderr,
    )
    df = _with_retries(
        lambda: _download_period(ticker, period=f"{INITIAL_LOOKBACK_DAYS}d"),
        max_retries=max_retries,
        retry_delay=retry_delay,
    )

    if df.empty:
        raise RuntimeError(
            f"Could not download data for '{ticker}' after {max_retries} attempts.\n"
            f"You can also place a CSV manually at:\n  {cache_file}\n"
            f"Expected columns: Date, Open, High, Low, Close, Volume"
        )

    df.to_csv(cache_file, index=False)
    print(f"[data_loader] Saved initial cache: {cache_file} ({len(df)} rows)", file=sys.stderr)
    return df

#!/usr/bin/env python3
"""
sentiment_news.py — fetch news + sentiment scores for a stock ticker via yfinance.

Usage:
  python sentiment_news.py --symbol AAPL --mode sentiment
  python sentiment_news.py --symbol AAPL --mode news
"""

import argparse
import json
import sys

import yfinance as yf


def score_headline(title: str) -> dict:
    """
    Simple lexicon-based sentiment scorer.
    Returns { score: float[-1,1], label: 'Positive'|'Negative'|'Neutral' }
    """
    POSITIVE_WORDS = {
        "surge", "surges", "surged", "gain", "gains", "gained", "rise", "rises", "rose",
        "rally", "rallied", "soar", "soars", "soared", "jump", "jumps", "jumped",
        "beat", "beats", "record", "high", "profit", "growth", "up", "upgrade",
        "buy", "outperform", "strong", "positive", "bull", "bullish", "boost",
        "boosted", "win", "wins", "won", "revenue", "earnings", "dividend",
        "breakthrough", "expand", "expands", "expansion", "advance", "advances",
    }
    NEGATIVE_WORDS = {
        "fall", "falls", "fell", "drop", "drops", "dropped", "decline", "declines",
        "declined", "loss", "losses", "miss", "misses", "missed", "cut", "cuts",
        "down", "downgrade", "weak", "negative", "bear", "bearish", "crash",
        "sell", "selloff", "sink", "sinks", "sank", "plunge", "plunges", "plunged",
        "concern", "concerns", "risk", "lawsuit", "fine", "penalty", "fraud",
        "recall", "warning", "debt", "layoff", "layoffs", "bankrupt",
    }

    words = title.lower().split()
    pos = sum(1 for w in words if w.strip(".,!?;:\"'") in POSITIVE_WORDS)
    neg = sum(1 for w in words if w.strip(".,!?;:\"'") in NEGATIVE_WORDS)
    total = pos + neg

    if total == 0:
        return {"score": 0.0, "label": "Neutral"}

    raw = (pos - neg) / total
    if raw > 0.1:
        label = "Positive"
    elif raw < -0.1:
        label = "Negative"
    else:
        label = "Neutral"

    return {"score": round(raw, 3), "label": label}


def fetch_news(symbol: str) -> list[dict]:
    ticker = yf.Ticker(symbol)
    raw_news = ticker.news or []

    articles = []
    for item in raw_news[:30]:  # cap at 30
        content = item.get("content", {}) if isinstance(item, dict) else {}
        title = (
            content.get("title")
            or item.get("title", "")
        )
        summary = (
            content.get("summary")
            or content.get("description")
            or item.get("summary", "")
            or ""
        )
        # publisher
        provider = content.get("provider", {}) or {}
        publisher = (
            provider.get("displayName")
            or item.get("publisher", "")
            or ""
        )
        # url
        canonical = content.get("canonicalUrl", {}) or {}
        url = (
            canonical.get("url")
            or item.get("link", "")
            or item.get("url", "")
            or ""
        )
        # thumbnail
        thumbnail = ""
        thumb_data = content.get("thumbnail", {}) or {}
        resolutions = thumb_data.get("resolutions", [])
        if resolutions:
            thumbnail = resolutions[0].get("url", "")

        # publish time
        pub_date = (
            content.get("pubDate")
            or content.get("displayTime")
            or item.get("providerPublishTime", "")
            or ""
        )
        if isinstance(pub_date, (int, float)):
            from datetime import datetime, timezone
            pub_date = datetime.fromtimestamp(pub_date, tz=timezone.utc).isoformat()

        sentiment = score_headline(title)

        articles.append({
            "title": title,
            "summary": summary[:300] if summary else "",
            "publisher": publisher,
            "url": url,
            "thumbnail": thumbnail,
            "publishedAt": pub_date,
            "sentiment": sentiment,
        })

    return articles


def build_sentiment_summary(articles: list[dict]) -> dict:
    if not articles:
        return {
            "overallScore": 0.0,
            "overallLabel": "Neutral",
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "total": 0,
            "breakdown": [],
        }

    positive = sum(1 for a in articles if a["sentiment"]["label"] == "Positive")
    negative = sum(1 for a in articles if a["sentiment"]["label"] == "Negative")
    neutral  = sum(1 for a in articles if a["sentiment"]["label"] == "Neutral")
    total    = len(articles)

    avg_score = round(sum(a["sentiment"]["score"] for a in articles) / total, 3)

    if avg_score > 0.1:
        overall_label = "Positive"
    elif avg_score < -0.1:
        overall_label = "Negative"
    else:
        overall_label = "Neutral"

    # top 5 most recent for breakdown display
    breakdown = [
        {
            "title": a["title"],
            "publisher": a["publisher"],
            "publishedAt": a["publishedAt"],
            "sentiment": a["sentiment"],
        }
        for a in articles[:5]
    ]

    return {
        "overallScore": avg_score,
        "overallLabel": overall_label,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "total": total,
        "breakdown": breakdown,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol", required=True)
    parser.add_argument("--mode", choices=["sentiment", "news"], default="news")
    args = parser.parse_args()

    symbol = args.symbol.strip().upper()

    try:
        articles = fetch_news(symbol)

        if args.mode == "news":
            result = {"symbol": symbol, "articles": articles}
        else:
            summary = build_sentiment_summary(articles)
            result = {"symbol": symbol, **summary}

        print(json.dumps(result))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

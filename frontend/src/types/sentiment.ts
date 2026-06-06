export interface SentimentBreakdownItem {
    title:       string
    publisher:   string
    publishedAt: string
    sentiment: {
        score: number
        label: "Positive" | "Negative" | "Neutral"
    }
}

export interface SentimentData {
    symbol:       string
    overallScore: number
    overallLabel: "Positive" | "Negative" | "Neutral"
    positive:     number
    negative:     number
    neutral:      number
    total:        number
    breakdown:    SentimentBreakdownItem[]
}

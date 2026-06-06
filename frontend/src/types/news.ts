export interface NewsArticle {
    title:       string
    summary:     string
    publisher:   string
    url:         string
    thumbnail:   string
    publishedAt: string
    sentiment: {
        score: number
        label: "Positive" | "Negative" | "Neutral"
    }
}

export interface NewsData {
    symbol:   string
    articles: NewsArticle[]
}

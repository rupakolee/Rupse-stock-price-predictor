export interface PredictionPoint {
    day: string
    projected: number
    bullish: number
    bearish: number
}

export interface PredictionSession {
    datetime: string
    open: number
    high: number
    low: number
    close: number
    volume: number
    changePct: number
}

export interface PredictionData {
    symbol: string
    currentPrice: number
    nextClose: number
    expectedMove: number
    horizonReturn: number
    confidenceLow: number
    confidenceHigh: number
    confidenceSpread: number
    bias: "Bullish" | "Bearish" | "Neutral"
    biasTone: string
    trendScore: number
    totalReturn: number
    volatility: number
    meanReturn: number
    momentum: number
    movingAverage20: number
    movingAverage50: number
    latestDate: string
    recentCount: number
    horizonDays: number
    points: PredictionPoint[]
    recentSessions: PredictionSession[]
}
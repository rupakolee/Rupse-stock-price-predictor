export interface MarketValue {
    datetime: string
    open:     string
    high:     string
    low:      string
    close:    string
    volume:   string
}

export interface MarketMeta {
    symbol:   string
    interval: string
    currency: string
    exchange: string
}

export interface MarketData {
    meta:   MarketMeta
    values: MarketValue[]
}

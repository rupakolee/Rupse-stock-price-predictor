import { useMemo, useState, type FormEvent } from 'react'
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    CalendarRange,
    Gauge,
    Search,
    TrendingDown,
    TrendingUp,
} from 'lucide-react'
import { useGetMarketDataByTicker } from '@/server-action/api/market.api'
import { StockLoader } from '@/components/ui'

const RANGE_OPTIONS = [
    { label: '1M', months: 1 },
    { label: '3M', months: 3 },
    { label: '6M', months: 6 },
    { label: '1Y', months: 12 },
    { label: '2Y', months: 24 },
]

const toNumber = (value: string) => Number.parseFloat(value)

const getStartDate = (months: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() - months)
    return date
}

const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    return `$${value.toFixed(2)}`
}

const formatPercent = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

const formatVolume = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
    return value.toFixed(0)
}

const calculateMaxDrawdown = (closes: number[]) => {
    if (closes.length < 2) return null

    let peak = closes[0]
    let maxDrawdown = 0

    for (const close of closes) {
        if (close > peak) {
            peak = close
        }

        const drawdown = ((close - peak) / peak) * 100
        if (drawdown < maxDrawdown) {
            maxDrawdown = drawdown
        }
    }

    return maxDrawdown
}

const AnalyticsPage = () => {
    const [ticker, setTicker] = useState('AAPL')
    const [input, setInput] = useState('AAPL')
    const [months, setMonths] = useState(12)

    const { data, isLoading, error } = useGetMarketDataByTicker(ticker)

    const analytics = useMemo(() => {
        if (!data?.values?.length) return null

        const cutoffDate = getStartDate(months)
        const filtered = [...data.values]
            .filter((value) => new Date(value.datetime) >= cutoffDate)
            .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())

        if (!filtered.length) return null

        const closes = filtered.map((value) => toNumber(value.close))
        const highs = filtered.map((value) => toNumber(value.high))
        const lows = filtered.map((value) => toNumber(value.low))
        const volumes = filtered.map((value) => toNumber(value.volume))
        const returns = closes.slice(1).map((close, index) => ((close - closes[index]) / closes[index]) * 100)
        const latest = filtered.at(-1)
        const first = filtered[0]
        const latestClose = latest ? toNumber(latest.close) : null
        const previousClose = filtered.length > 1 ? toNumber(filtered.at(-2)!.close) : null
        const latestChange = latestClose !== null && previousClose !== null ? latestClose - previousClose : null
        const latestChangePct = latestChange !== null && previousClose ? (latestChange / previousClose) * 100 : null
        const totalReturn = closes.length > 1 ? ((closes.at(-1)! - closes[0]) / closes[0]) * 100 : null
        const bestDay = returns.length ? Math.max(...returns) : null
        const worstDay = returns.length ? Math.min(...returns) : null
        const averageReturn = returns.length
            ? returns.reduce((sum, value) => sum + value, 0) / returns.length
            : null
        const bullishDays = returns.length
            ? (returns.filter((value) => value >= 0).length / returns.length) * 100
            : null
        const averageVolume = volumes.reduce((sum, value) => sum + value, 0) / volumes.length
        const averageRangePct = filtered.reduce((sum, value) => {
            const high = toNumber(value.high)
            const low = toNumber(value.low)
            const close = toNumber(value.close)
            return sum + ((high - low) / close) * 100
        }, 0) / filtered.length
        const maxDrawdown = calculateMaxDrawdown(closes)
        const volatility = returns.length > 1
            ? Math.sqrt(returns.reduce((sum, value) => sum + Math.pow(value - (averageReturn ?? 0), 2), 0) / (returns.length - 1))
            : null

        return {
            latest,
            first,
            latestClose,
            latestChange,
            latestChangePct,
            totalReturn,
            bestDay,
            worstDay,
            averageReturn,
            bullishDays,
            averageVolume,
            averageRangePct,
            maxDrawdown,
            volatility,
            sessionCount: filtered.length,
            high: Math.max(...highs),
            low: Math.min(...lows),
            recentSessions: filtered.slice(-5).reverse(),
        }
    }, [data, months])

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const nextTicker = input.trim().toUpperCase()
        if (nextTicker) setTicker(nextTicker)
    }

    const trendClass = analytics?.totalReturn !== null && analytics?.totalReturn !== undefined
        ? analytics.totalReturn >= 0
            ? 'text-emerald-400'
            : 'text-rose-400'
        : 'text-muted-foreground'

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Analytics</p>
                    <h2 className="text-2xl font-bold tracking-tight">Market Analytics</h2>
                    <p className="text-sm text-muted-foreground">
                        Read the strength, volatility, and recent behavior of a ticker in one place.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value.toUpperCase())}
                            placeholder="AAPL"
                            className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-32"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {RANGE_OPTIONS.map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                onClick={() => setMonths(option.months)}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${months === option.months
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Analyze
                    </button>
                </form>
            </div>

            {isLoading && <StockLoader />}

            {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                    Error: {String(error)}
                </div>
            )}

            {!isLoading && !error && analytics && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Latest Close</p>
                            <div className="mt-3 flex items-end justify-between gap-3">
                                <p className="text-2xl font-bold text-black">{formatCurrency(analytics.latestClose)}</p>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${analytics.latestChangePct !== null && analytics.latestChangePct >= 0
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-rose-500/10 text-rose-500'
                                    }`}>
                                    {analytics.latestChangePct !== null && analytics.latestChangePct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {formatPercent(analytics.latestChangePct)}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {data?.meta?.symbol ?? ticker} from {data?.meta?.exchange ?? 'the selected exchange'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Period Return</p>
                            <p className={`mt-3 text-2xl font-bold ${trendClass}`}>{formatPercent(analytics.totalReturn)}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Performance over the last {months} month(s)</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Volatility</p>
                            <p className="mt-3 text-2xl font-bold text-black">{formatPercent(analytics.volatility)}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Daily close-to-close variation</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Average Volume</p>
                            <p className="mt-3 text-2xl font-bold text-black">{formatVolume(analytics.averageVolume)}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Mean traded shares per session</p>
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold">Signal Summary</h3>
                                    <p className="text-sm text-muted-foreground">A compact read on trend quality and risk profile.</p>
                                </div>
                                <Activity className="h-5 w-5 text-primary" />
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        Bullish Sessions
                                    </div>
                                    <p className="mt-3 text-2xl font-bold text-emerald-500">{analytics.bullishDays !== null ? `${analytics.bullishDays.toFixed(1)}%` : '—'}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">Share of sessions that closed higher than the previous day.</p>
                                </div>

                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <TrendingDown className="h-4 w-4 text-rose-500" />
                                        Max Drawdown
                                    </div>
                                    <p className="mt-3 text-2xl font-bold text-red-500">{formatPercent(analytics.maxDrawdown)}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">Largest peak-to-trough decline in the selected window.</p>
                                </div>

                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Gauge className="h-4 w-4 text-primary" />
                                        Average Daily Range
                                    </div>
                                    <p className="mt-3 text-2xl font-bold text-black">{analytics.averageRangePct !== null ? `${analytics.averageRangePct.toFixed(2)}%` : '—'}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">Typical intraday spread from low to high.</p>
                                </div>

                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                        Session Count
                                    </div>
                                    <p className="mt-3 text-2xl font-bold text-black">{analytics.sessionCount}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">Trading days included in this analysis window.</p>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Window High</p>
                                    <p className="mt-2 text-lg font-semibold text-black">{formatCurrency(analytics.high)}</p>
                                </div>
                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Window Low</p>
                                    <p className="mt-2 text-lg font-semibold text-black">{formatCurrency(analytics.low)}</p>
                                </div>
                                <div className="rounded-xl border border-border/70 bg-background p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Best / Worst Day</p>
                                    <p className="mt-2 text-lg font-semibold text-emerald-500">{formatPercent(analytics.bestDay)}</p>
                                    <p className="text-sm font-medium text-rose-500">{formatPercent(analytics.worstDay)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <CalendarRange className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Recent Sessions</h3>
                            </div>

                            <div className="mt-4 space-y-3">
                                {analytics.recentSessions.map((session, index) => {
                                    const close = toNumber(session.close)
                                    const open = toNumber(session.open)
                                    const change = close - open
                                    const changePct = open ? (change / open) * 100 : null

                                    return (
                                        <div key={`${session.datetime}-${index}`} className="rounded-xl border border-border/70 bg-background p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {new Date(session.datetime).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">Open {formatCurrency(open)} · Close {formatCurrency(close)}</p>
                                                </div>

                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${change >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                    {formatPercent(changePct)}
                                                </span>
                                            </div>

                                            <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                                                <div>
                                                    <p className="font-semibold uppercase tracking-wide">High</p>
                                                    <p className="mt-1 text-foreground">{formatCurrency(toNumber(session.high))}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold uppercase tracking-wide">Low</p>
                                                    <p className="mt-1 text-foreground">{formatCurrency(toNumber(session.low))}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold uppercase tracking-wide">Volume</p>
                                                    <p className="mt-1 text-foreground">{formatVolume(toNumber(session.volume))}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Activity className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">What this page should tell you</h3>
                                <p className="text-sm text-muted-foreground">This is the decision layer above the raw price chart.</p>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="font-medium">Trend quality</p>
                                <p className="mt-2 text-sm text-muted-foreground">Use period return and bullish-session share to see whether the ticker has been drifting upward or sideways.</p>
                            </div>
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="font-medium">Risk behavior</p>
                                <p className="mt-2 text-sm text-muted-foreground">Volatility, drawdown, and daily range tell you how violent the moves are before you size a trade.</p>
                            </div>
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="font-medium">Recent momentum</p>
                                <p className="mt-2 text-sm text-muted-foreground">The last few sessions reveal whether the latest move is accelerating or fading.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnalyticsPage

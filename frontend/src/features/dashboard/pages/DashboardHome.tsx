import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useGetMarketDataByTicker } from '@/server-action/api/market.api'
import type { MarketValue } from '@/types/market'
import StockChart from '../chart/index.jsx'
import { StockLoader } from '@/components/ui'


const getStartDate = (months: number) => {
    const d = new Date()
    d.setMonth(d.getMonth() - months)
    return d
}

const buildChartData = (values: MarketValue[], months: number) => {
    const startDate = getStartDate(months)
    const filtered = values
        .filter(v => new Date(v.datetime) >= startDate)
        .reverse()

    return filtered.map((item, idx, arr) => {
        const prev = arr[idx - 1]
        const close = parseFloat(item.close)
        const change = prev ? close - parseFloat(prev.close) : 0
        const date = new Date(item.datetime)
        const time = months <= 3
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

        return {
            time,
            rawDate: item.datetime,
            value: close,
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            change,
        }
    })
}

const DashboardHome = () => {
    const [ticker, setTicker] = useState('AAPL')
    const [input, setInput] = useState('AAPL')
    const [months, setMonths] = useState(12)

    const { data, isLoading, error } = useGetMarketDataByTicker(ticker)

    const chartData = useMemo(() => {
        if (!data?.values?.length) return []
        return buildChartData(data.values, months)
    }, [data, months])

    const trendColor = useMemo(() => {
        if (chartData.length < 2) return '#6B7280'
        const pct = ((chartData.at(-1)!.value - chartData[0].value) / chartData[0].value) * 100
        if (pct > 0.5) return '#10b981'
        if (pct < -0.5) return '#ef4444'
        return '#6B7280'
    }, [chartData])

    const values = data?.values ?? []
    const meta = data?.meta
    const latest = values[0]
    const latestClose = latest ? Number(latest.close) : null
    const prevClose = values[1] ? Number(values[1].close) : null
    const dayChange = latestClose !== null && prevClose !== null ? latestClose - prevClose : null
    const dayChangePct = dayChange !== null && prevClose ? (dayChange / prevClose) * 100 : null
    const exchangeLabel = meta?.exchange?.trim() || 'Unavailable'
    const currencyLabel = meta?.currency?.trim() || '—'

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) setTicker(input.trim().toUpperCase())
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Overview</h2>
                    <p className="text-sm text-muted-foreground">Monitor your real-time market performance.</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value.toUpperCase())}
                            placeholder="TSLA"
                            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-28"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        Search
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">{meta?.symbol ?? ticker} - Latest Close</p>
                    <p className="text-xl font-bold text-white">{latestClose !== null ? `$${latestClose.toFixed(2)}` : '—'}</p>
                    {dayChangePct !== null && (
                        <p className={`text-xs mt-1 ${dayChangePct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {dayChangePct >= 0 ? '+' : ''}{dayChangePct.toFixed(2)}% today
                        </p>
                    )}
                </div>
                <div className="bg-card p-4 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Exchange</p>
                    <p className="text-xl font-bold text-white">{exchangeLabel}</p>
                    <p className="text-xs text-muted-foreground mt-1">{currencyLabel}</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Data Points</p>
                    <p className="text-xl font-bold text-white">{values.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Daily intervals</p>
                </div>
            </div>

            {isLoading && (
                <StockLoader />
            )}
            {error && (
                <div className="bg-card rounded-xl border border-border p-8 text-center text-destructive text-sm">
                    {String(error).includes("TWELVE_DATA_API_KEY") ? (
                        <div>
                            <p className="font-medium">Server configuration required</p>
                            <p className="text-xs mt-2">The backend is missing the Twelve Data API key which is required to fetch market data.</p>
                            <p className="text-xs mt-2">To fix locally, add <code>TWELVE_DATA_API_KEY=your_api_key</code> to <strong>backend/.env</strong> and restart the backend server.</p>
                        </div>
                    ) : (
                        <div>
                            Error: {String(error)}
                        </div>
                    )}
                </div>
            )}
            {!isLoading && !error && (
                <StockChart
                    chartData={chartData}
                    trendColor={trendColor}
                    symbol={data?.meta?.symbol ?? ticker}
                    onRangeChange={setMonths}
                />
            )}
        </div>
    )
}

export default DashboardHome

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Brain,
    Search,
    Sparkles,
    Target,
} from 'lucide-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js'
import { useGetPredictionByTicker } from '@/server-action/api/prediction.api'
import { StockLoader } from '@/components/ui'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler, Tooltip, Legend)

const HORIZON_OPTIONS = [
    { label: '5D', days: 5 },
    { label: '10D', days: 10 },
    { label: '1M', days: 21 },
    { label: '3M', days: 63 },
]

const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    return `$${value.toFixed(2)}`
}

const formatPercent = (value?: number | null) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

const formatChartLabel = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}

const PredictionChart = ({ data }: { data: NonNullable<ReturnType<typeof useGetPredictionByTicker>['data']> }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const chartRef = useRef<ChartJS | null>(null)

    const chartPayload = useMemo(() => {
        const actualSeries = [...(data.recentSessions ?? [])].reverse().map((session) => ({
            label: formatChartLabel(session.datetime),
            actual: session.close,
            predicted: null as number | null,
        }))

        const forecastSeries = [
            { label: 'Now', actual: data.currentPrice, predicted: data.currentPrice },
            ...(data.points ?? []).map((point) => ({
                label: point.day,
                actual: null as number | null,
                predicted: point.projected,
            })),
        ]

        const labels = [...actualSeries.map((item) => item.label), ...forecastSeries.map((item) => item.label)]
        const actual = [...actualSeries.map((item) => item.actual), ...forecastSeries.map((item) => item.actual)]
        const predicted = [...actualSeries.map((item) => item.predicted), ...forecastSeries.map((item) => item.predicted)]

        return { labels, actual, predicted }
    }, [data])

    useEffect(() => {
        if (!canvasRef.current) return

        const existing = ChartJS.getChart(canvasRef.current)
        if (existing) existing.destroy()
        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        }

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        chartRef.current = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: chartPayload.labels,
                datasets: [
                    {
                        label: 'Actual price',
                        data: chartPayload.actual,
                        borderColor: '#38bdf8',
                        backgroundColor: '#38bdf833',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0,
                        spanGaps: false,
                    },
                    {
                        label: 'Predicted price',
                        data: chartPayload.predicted,
                        borderColor: '#f59e0b',
                        backgroundColor: '#f59e0b33',
                        borderDash: [6, 6],
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0,
                        spanGaps: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#9ca3af',
                            usePointStyle: true,
                            pointStyle: 'line',
                            boxWidth: 18,
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: $${Number(ctx.raw).toFixed(2)}`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: '#6B7280', maxTicksLimit: 10 },
                        grid: { display: false },
                    },
                    y: {
                        ticks: {
                            color: '#6B7280',
                            callback: (value) => `$${Number(value).toFixed(0)}`,
                        },
                        grid: { color: '#6B728020' },
                    },
                },
            },
        })

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        }
    }, [chartPayload])

    return <canvas ref={canvasRef} className="h-full w-full" />
}

const PredictionsPage = () => {
    const [ticker, setTicker] = useState('AAPL')
    const [input, setInput] = useState('AAPL')
    const [horizon, setHorizon] = useState(5)

    const { data, isLoading, error } = useGetPredictionByTicker(ticker, { horizon })

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const nextTicker = input.trim().toUpperCase()
        if (nextTicker) setTicker(nextTicker)
    }

    const tone = data?.biasTone ?? 'text-muted-foreground'

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">Predictions</p>
                    <h2 className="text-2xl font-bold tracking-tight">Forecast Engine</h2>
                    <p className="text-sm text-muted-foreground">
                        Short-horizon price outlook built from recent market behavior and trend strength.
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
                        {HORIZON_OPTIONS.map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                onClick={() => setHorizon(option.days)}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${horizon === option.days
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
                        Run forecast
                    </button>
                </form>
            </div>

            {isLoading && <StockLoader />}

            {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                    Error: {String(error)}
                </div>
            )}

            {!isLoading && !error && data && (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Next Close Estimate</p>
                            <div className="mt-3 flex items-end justify-between gap-3">
                                <p className="text-2xl font-bold text-black">{formatCurrency(data.nextClose)}</p>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${data.expectedMove >= 0
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-rose-500/10 text-rose-500'
                                    }`}>
                                    {data.expectedMove >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {formatPercent(data.expectedMove)}
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">Estimated next session based on recent return drift.</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Horizon Return</p>
                            <p className={`mt-3 text-2xl font-bold ${tone}`}>{formatPercent(data.horizonReturn)}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Projected move over the selected horizon.</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prediction Bias</p>
                            <p className={`mt-3 text-2xl font-bold ${tone}`}>{data.bias}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Trend score from momentum and moving-average spread.</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Confidence Spread</p>
                            <p className="mt-3 text-2xl font-bold text-black">{formatPercent(data.confidenceSpread)}</p>
                            <p className="mt-2 text-xs text-muted-foreground">Gap between bullish and bearish scenario endpoints.</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold">Actual vs Predicted Price</h3>
                                <p className="text-sm text-muted-foreground">
                                    Historical closes in blue, forecast path in amber.
                                </p>
                            </div>
                            <Activity className="h-5 w-5 text-primary" />
                        </div>

                        <div className="mt-5 h-72">
                            <PredictionChart data={data} />
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold">Scenario Path</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Base, bullish, and bearish projections for the next {data.horizonDays} trading day(s).
                                    </p>
                                </div>
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>

                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">Date</th>
                                            <th className="px-3 py-2">Bearish</th>
                                            <th className="px-3 py-2">Base</th>
                                            <th className="px-3 py-2">Bullish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.points.map((point) => (
                                            <tr key={point.day} className="border-b border-border/60 last:border-0">
                                                <td className="px-3 py-3 font-medium text-foreground">{point.day}</td>
                                                <td className="px-3 py-3 text-rose-400">{formatCurrency(point.bearish)}</td>
                                                <td className="px-3 py-3 text-foreground">{formatCurrency(point.projected)}</td>
                                                <td className="px-3 py-3 text-emerald-400">{formatCurrency(point.bullish)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Brain className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Model Lens</h3>
                                </div>

                                <div className="mt-4 space-y-4">
                                    <div className="rounded-xl border border-border/70 bg-background p-4">
                                        <p className="font-medium">Trend strength</p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {data.momentum >= 0
                                                ? 'Recent prices are trading above the short-term average, which supports the upside case.'
                                                : 'Recent prices are trading below the short-term average, which weakens the upside case.'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border/70 bg-background p-4">
                                        <p className="font-medium">Risk check</p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            The prediction widens when volatility increases, so a wide band means the ticker is still moving aggressively.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border/70 bg-background p-4">
                                        <p className="font-medium">Reference window</p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Built from the most recent {data.recentCount} sessions ending on {new Date(data.latestDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-semibold">Decision Snapshot</h3>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-border/70 bg-background p-4 text-foreground">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Current price</p>
                                        <p className="mt-2 text-lg font-semibold text-grey">{formatCurrency(data.currentPrice)}</p>
                                    </div>
                                    <div className="rounded-xl border border-border/70 bg-background p-4 text-foreground">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Window return</p>
                                        <p className={`mt-2 text-lg font-semibold ${data.totalReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {formatPercent(data.totalReturn)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-border/70 bg-background p-4 text-foreground">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">20-day avg</p>
                                        <p className="mt-2 text-lg font-semibold text-grey">{formatCurrency(data.movingAverage20)}</p>
                                    </div>
                                    <div className="rounded-xl border border-border/70 bg-background p-4 text-foreground">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 ">50-day avg</p>
                                        <p className="mt-2 text-lg font-semibold text-grey">{formatCurrency(data.movingAverage50)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Activity className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">How to read this page</h3>
                                <p className="text-sm text-muted-foreground">This is a directional forecast panel, not a guarantee.</p>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="font-medium">Bull case</p>
                                <p className="mt-2 text-sm text-muted-foreground">Use the bullish path when momentum is holding above the short-term average and volatility stays contained.</p>
                            </div>
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="font-medium">Base case</p>
                                <p className="mt-2 text-sm text-muted-foreground">The middle path follows the average recent return, which is useful for rough planning and comparison.</p>
                            </div>
                            <div className="rounded-xl border border-border/70 bg-background p-4">
                                <p className="font-medium">Bear case</p>
                                <p className="mt-2 text-sm text-muted-foreground">The bearish path shows where price could drift if the move loses momentum or volatility expands lower.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PredictionsPage

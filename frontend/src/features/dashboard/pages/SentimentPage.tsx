import { useState, type FormEvent } from 'react'
import {
    Search,
    TrendingUp,
    TrendingDown,
    Minus,
    ThumbsUp,
    ThumbsDown,
    Newspaper,
    BarChart3,
} from 'lucide-react'
import { useGetSentimentByTicker } from '@/server-action/api/sentiment.api'
import { StockLoader } from '@/components/ui'
import type { SentimentData, SentimentBreakdownItem } from '@/types/sentiment'

// ─── helpers ────────────────────────────────────────────────────────────────

const labelColor = (label: string) => {
    if (label === 'Positive') return 'text-emerald-500'
    if (label === 'Negative') return 'text-rose-500'
    return 'text-muted-foreground'
}

const labelBg = (label: string) => {
    if (label === 'Positive') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    if (label === 'Negative') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
    return 'bg-muted text-muted-foreground'
}

const LabelIcon = ({ label }: { label: string }) => {
    if (label === 'Positive') return <TrendingUp size={14} />
    if (label === 'Negative') return <TrendingDown size={14} />
    return <Minus size={14} />
}

const formatDate = (iso: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Gauge ───────────────────────────────────────────────────────────────────

const SentimentGauge = ({ score }: { score: number }) => {
    // score is -1 to 1; map to 0–180 degrees
    const clamped = Math.max(-1, Math.min(1, score))
    const degrees = ((clamped + 1) / 2) * 180  // 0 → 0°, 1 → 180°

    const needleX = 100 + 75 * Math.cos(((degrees - 180) * Math.PI) / 180)
    const needleY = 100 - 75 * Math.sin(((180 - degrees) * Math.PI) / 180)

    return (
        <svg viewBox="0 0 200 120" className="w-full max-w-xs mx-auto">
            {/* arc background */}
            <path d="M 20,100 A 80,80 0 0 1 180,100" fill="none" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round" />
            <path d="M 60,32 A 80,80 0 0 1 140,32" fill="none" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" />
            <path d="M 120,18 A 80,80 0 0 1 180,100" fill="none" stroke="#10b981" strokeWidth="14" strokeLinecap="round" />

            {/* needle */}
            <line
                x1="100" y1="100"
                x2={needleX} y2={needleY}
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                className="text-foreground"
            />
            <circle cx="100" cy="100" r="5" className="fill-foreground" />

            {/* score text */}
            <text x="100" y="118" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-mono">
                {score >= 0 ? '+' : ''}{score.toFixed(2)}
            </text>
        </svg>
    )
}

// ─── Breakdown row ────────────────────────────────────────────────────────────

const BreakdownRow = ({ item }: { item: SentimentBreakdownItem }) => (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
        <span className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${labelBg(item.sentiment.label)}`}>
            <LabelIcon label={item.sentiment.label} />
        </span>
        <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug text-foreground line-clamp-2">{item.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                <span>{item.publisher}</span>
                <span>·</span>
                <span>{formatDate(item.publishedAt)}</span>
                <span className={`font-semibold ${labelColor(item.sentiment.label)}`}>
                    {item.sentiment.label}
                </span>
            </div>
        </div>
        <span className={`flex-shrink-0 text-sm font-bold ${labelColor(item.sentiment.label)}`}>
            {item.sentiment.score >= 0 ? '+' : ''}{item.sentiment.score.toFixed(2)}
        </span>
    </div>
)

// ─── Distribution bar ─────────────────────────────────────────────────────────

const DistBar = ({ data }: { data: SentimentData }) => {
    const total = data.total || 1
    const posW = (data.positive / total) * 100
    const negW = (data.negative / total) * 100
    const neuW = (data.neutral  / total) * 100

    return (
        <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Coverage breakdown ({data.total} articles)
            </p>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                <div style={{ width: `${posW}%` }} className="bg-emerald-500 transition-all" />
                <div style={{ width: `${neuW}%` }} className="bg-amber-400 transition-all" />
                <div style={{ width: `${negW}%` }} className="bg-rose-500 transition-all" />
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Positive {data.positive}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
                    Neutral {data.neutral}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
                    Negative {data.negative}
                </span>
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SentimentPage = () => {
    const [ticker, setTicker] = useState('AAPL')
    const [input, setInput]   = useState('AAPL')

    const { data, isLoading, error } = useGetSentimentByTicker(ticker)

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const next = input.trim().toUpperCase()
        if (next) setTicker(next)
    }

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">Sentiment</p>
                    <h2 className="text-2xl font-bold tracking-tight">News Sentiment Analysis</h2>
                    <p className="text-sm text-muted-foreground">
                        Aggregated sentiment score derived from recent news headlines via Yahoo Finance.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value.toUpperCase())}
                            placeholder="AAPL"
                            className="w-32 rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Analyse
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
                    {/* ── Top stat cards ── */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {/* Overall label */}
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Overall Sentiment
                            </p>
                            <div className={`mt-3 flex items-center gap-2 text-2xl font-bold ${labelColor(data.overallLabel)}`}>
                                <LabelIcon label={data.overallLabel} />
                                {data.overallLabel}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">Aggregated from {data.total} recent articles.</p>
                        </div>

                        {/* Score */}
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sentiment Score</p>
                            <p className={`mt-3 text-2xl font-bold ${labelColor(data.overallLabel)}`}>
                                {data.overallScore >= 0 ? '+' : ''}{data.overallScore.toFixed(3)}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">Scale −1 (most negative) to +1 (most positive).</p>
                        </div>

                        {/* Positive count */}
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Positive Articles</p>
                            <div className="mt-3 flex items-end gap-2">
                                <p className="text-2xl font-bold text-emerald-500">{data.positive}</p>
                                <ThumbsUp size={18} className="mb-1 text-emerald-500" />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {data.total > 0 ? `${((data.positive / data.total) * 100).toFixed(0)}% of coverage` : '—'}
                            </p>
                        </div>

                        {/* Negative count */}
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Negative Articles</p>
                            <div className="mt-3 flex items-end gap-2">
                                <p className="text-2xl font-bold text-rose-500">{data.negative}</p>
                                <ThumbsDown size={18} className="mb-1 text-rose-500" />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {data.total > 0 ? `${((data.negative / data.total) * 100).toFixed(0)}% of coverage` : '—'}
                            </p>
                        </div>
                    </div>

                    {/* ── Gauge + distribution ── */}
                    <div className="grid gap-6 xl:grid-cols-2">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center gap-4">
                            <div className="flex items-center gap-2 self-start">
                                <BarChart3 size={18} className="text-primary" />
                                <h3 className="text-lg font-semibold">Sentiment Gauge</h3>
                            </div>
                            <SentimentGauge score={data.overallScore} />
                            <p className="text-xs text-muted-foreground text-center">
                                Red = negative · Amber = neutral · Green = positive
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <Newspaper size={18} className="text-primary" />
                                <h3 className="text-lg font-semibold">Coverage Distribution</h3>
                            </div>
                            <DistBar data={data} />
                        </div>
                    </div>

                    {/* ── Breakdown list ── */}
                    {data.breakdown.length > 0 && (
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold">Top Recent Headlines</h3>
                            <div className="space-y-3">
                                {data.breakdown.map((item, idx) => (
                                    <BreakdownRow key={idx} item={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SentimentPage

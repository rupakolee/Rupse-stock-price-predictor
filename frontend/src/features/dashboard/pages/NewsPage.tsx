import { useState, type FormEvent } from 'react'
import {
    Search,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    Minus,
    Clock,
    Newspaper,
} from 'lucide-react'
import { useGetNewsByTicker } from '@/server-action/api/news.api'
import { StockLoader } from '@/components/ui'
import type { NewsArticle } from '@/types/news'

// ─── helpers ────────────────────────────────────────────────────────────────

const labelColor = (label: string) => {
    if (label === 'Positive') return 'text-emerald-500'
    if (label === 'Negative') return 'text-rose-500'
    return 'text-muted-foreground'
}

const labelBg = (label: string) => {
    if (label === 'Positive') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    if (label === 'Negative') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
    return 'bg-muted text-muted-foreground border-border'
}

const LabelIcon = ({ label }: { label: string }) => {
    if (label === 'Positive') return <TrendingUp size={11} />
    if (label === 'Negative') return <TrendingDown size={11} />
    return <Minus size={11} />
}

const FILTER_OPTIONS = ['All', 'Positive', 'Negative', 'Neutral'] as const
type Filter = (typeof FILTER_OPTIONS)[number]

const formatDate = (iso: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const NewsCard = ({ article }: { article: NewsArticle }) => (
    <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
        {/* thumbnail */}
        {article.thumbnail ? (
            <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
            </div>
        ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-muted">
                <Newspaper size={32} className="text-muted-foreground/30" />
            </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-4">
            {/* sentiment badge */}
            <div className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${labelBg(article.sentiment.label)}`}>
                    <LabelIcon label={article.sentiment.label} />
                    {article.sentiment.label}
                </span>
                <span className={`text-xs font-bold ${labelColor(article.sentiment.label)}`}>
                    {article.sentiment.score >= 0 ? '+' : ''}{article.sentiment.score.toFixed(2)}
                </span>
            </div>

            {/* title */}
            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-3">
                {article.title}
            </h3>

            {/* summary */}
            {article.summary && (
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{article.summary}</p>
            )}

            {/* footer */}
            <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 min-w-0">
                    <Clock size={11} className="flex-shrink-0" />
                    <span className="truncate">{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 text-primary">
                    <span className="font-medium truncate max-w-[100px]">{article.publisher}</span>
                    <ExternalLink size={11} />
                </div>
            </div>
        </div>
    </a>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

const NewsPage = () => {
    const [ticker, setTicker] = useState('AAPL')
    const [input, setInput]   = useState('AAPL')
    const [filter, setFilter] = useState<Filter>('All')

    const { data, isLoading, error } = useGetNewsByTicker(ticker)

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const next = input.trim().toUpperCase()
        if (next) {
            setTicker(next)
            setFilter('All')
        }
    }

    const articles = data?.articles ?? []
    const filtered = filter === 'All' ? articles : articles.filter(a => a.sentiment.label === filter)

    const positive = articles.filter(a => a.sentiment.label === 'Positive').length
    const negative = articles.filter(a => a.sentiment.label === 'Negative').length
    const neutral  = articles.filter(a => a.sentiment.label === 'Neutral').length

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">News</p>
                    <h2 className="text-2xl font-bold tracking-tight">Live Stock News</h2>
                    <p className="text-sm text-muted-foreground">
                        Real-time headlines sourced from Yahoo Finance via yfinance.
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
                        Search
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
                    {/* ── Summary strip ── */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{articles.length}</span> articles for{' '}
                            <span className="font-semibold text-primary">{data.symbol}</span>
                        </span>
                        <div className="flex flex-wrap gap-2 ml-auto">
                            <span className="text-xs rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 font-medium">
                                {positive} positive
                            </span>
                            <span className="text-xs rounded-full bg-muted text-muted-foreground px-2.5 py-1 font-medium">
                                {neutral} neutral
                            </span>
                            <span className="text-xs rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 font-medium">
                                {negative} negative
                            </span>
                        </div>
                    </div>

                    {/* ── Filter tabs ── */}
                    <div className="flex gap-2 flex-wrap">
                        {FILTER_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setFilter(opt)}
                                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                                    filter === opt
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {opt}
                                {opt !== 'All' && (
                                    <span className="ml-1.5 text-xs opacity-70">
                                        {opt === 'Positive' ? positive : opt === 'Negative' ? negative : neutral}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Grid ── */}
                    {filtered.length === 0 ? (
                        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                            No {filter.toLowerCase()} articles found.
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((article, idx) => (
                                <NewsCard key={idx} article={article} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NewsPage

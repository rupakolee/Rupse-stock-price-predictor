import { useState } from 'react'
import {
    BarChart2,
    Building2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Search,
} from 'lucide-react'
import type { FundamentalData } from '@/types/fundamental'
import { useGetFundamentalByTicker } from '@/server-action/api/fundamental.api'
import { StockLoader } from '@/components/ui'

const formatMarketCap = (cap: string) => {
    const n = Number(cap)
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
    return `$${n.toFixed(2)}`
}

const formatPct = (val: string) => `${(Number(val) * 100).toFixed(1)}%`

const buildSections = (d: FundamentalData) => [
    {
        title: 'Overview',
        icon: BarChart2,
        rows: [
            ['Name', d.Name],
            ['Symbol', d.Symbol],
            ['Exchange', d.Exchange],
            ['Website',
                <a
                    href={d.OfficialSite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {new URL(d.OfficialSite).hostname}
                </a>
            ],
        ],
    },
    {
        title: 'Company Details',
        icon: Building2,
        rows: [
            ['Sector', d.Sector],
            ['Industry', d.Industry],
            ['Country', d.Country],
        ],
    },
    {
        title: 'Valuation & Fundamentals',
        icon: DollarSign,
        rows: [
            ['Market Cap', formatMarketCap(d.MarketCapitalization)],
            ['P/E Ratio', d.PERatio],
            ['PEG Ratio', d.PEGRatio],
            ['Price-to-Book', d.PriceToBookRatio],
            ['Price-to-Sales', d.PriceToSalesRatioTTM],
            ['Forward P/E', d.ForwardPE],
        ],
    },
    {
        title: 'Performance & Profitability',
        icon: TrendingUp,
        rows: [
            ['EPS (TTM)', `$${d.EPS}`],
            ['Profit Margin', formatPct(d.ProfitMargin)],
            ['Operating Margin', formatPct(d.OperatingMarginTTM)],
            ['ROA', formatPct(d.ReturnOnAssetsTTM)],
            ['ROE', formatPct(d.ReturnOnEquityTTM)],
        ],
    },
    {
        title: 'Growth',
        icon: TrendingUp,
        rows: [
            ['Revenue (TTM)', formatMarketCap(d.RevenueTTM)],
            ['Earnings Growth (YoY)', formatPct(d.QuarterlyEarningsGrowthYOY)],
            ['Revenue Growth (YoY)', formatPct(d.QuarterlyRevenueGrowthYOY)],
        ],
    },
    {
        title: 'Stock Trend',
        icon: TrendingDown,
        rows: [
            ['52-Week Range', `$${d['52WeekLow']} – $${d['52WeekHigh']}`],
            ['50-Day Avg', `$${d['50DayMovingAverage']}`],
            ['200-Day Avg', `$${d['200DayMovingAverage']}`],
            ['Beta', d.Beta],
        ],
    },
    {
        title: 'Dividend Info',
        icon: DollarSign,
        rows: [
            ['Dividend/Share', `$${d.DividendPerShare}`],
            ['Dividend Yield', formatPct(d.DividendYield)],
            ['Ex-Dividend Date', d.ExDividendDate],
        ],
    },
    {
        title: 'Analyst Insights',
        icon: Users,
        rows: [
            ['Target Price', `$${d.AnalystTargetPrice}`],
            ['Ratings', `${Number(d.AnalystRatingStrongBuy) + Number(d.AnalystRatingBuy)} Buy/Strong Buy, ${d.AnalystRatingHold} Hold, ${Number(d.AnalystRatingSell) + Number(d.AnalystRatingStrongSell)} Sell`],
        ],
    },
]

const FundamentalPage = () => {
    const [ticker, setTicker] = useState('AAPL')
    const [input, setInput] = useState('AAPL')

    const { data, isLoading, error } = useGetFundamentalByTicker(ticker)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) setTicker(input.trim().toUpperCase())
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Fundamental Analysis</h2>
                    <p className="opacity-80 text-sm">Company overview and financial metrics.</p>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value.toUpperCase())}
                            placeholder="TSLA"
                            className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-28"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {isLoading && (
                <StockLoader />
            )}

            {error && (
                <div className="p-6 text-center text-destructive text-sm">
                    Error: {String(error)}
                </div>
            )}

            {data && (
                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm divide-y divide-gray-300 dark:divide-gray-700">
                        <tbody>
                            {buildSections(data).flatMap(({ title, icon: Icon, rows }, idx) => [
                                <tr key={`section-${idx}`} className="bg-blue-100 dark:bg-gray-800">
                                    <td colSpan={2} className="px-4 py-2 font-semibold text-gray-800 dark:text-gray-100">
                                        <span className="flex items-center gap-2">
                                            <Icon size={14} />
                                            {title}
                                        </span>
                                    </td>
                                </tr>,
                                ...rows.map(([label, value], rowIdx) => (
                                    <tr
                                        key={`row-${idx}-${rowIdx}`}
                                        className="even:bg-gray-100 dark:even:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300 w-1/3">{label}</td>
                                        <td className="px-4 py-2 text-right text-gray-900 dark:text-white">{value}</td>
                                    </tr>
                                )),
                            ])}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default FundamentalPage

import { CandlestickChart, AreaChart as AreaIcon } from 'lucide-react'

const CHART_TYPES = [
    { label: 'Area',        icon: AreaIcon          },
    { label: 'Candlestick', icon: CandlestickChart  },
]

const TIME_RANGES = [
    { label: '1M',  months: 1  },
    { label: '3M',  months: 3  },
    { label: '6M',  months: 6  },
    { label: '1Y',  months: 12 },
    { label: '3Y',  months: 36 },
    { label: '5Y',  months: 60 },
]

const ChartControls = ({ symbol, chartType, setChartType, selectedRange, setSelectedRange }) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">{symbol} Price Chart</h3>
                    <p className="text-xs text-muted-foreground">{selectedRange?.label} • {chartType}</p>
                </div>

                <div className="flex border border-border rounded-lg p-1 gap-1">
                    {CHART_TYPES.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            onClick={() => setChartType(label)}
                            className={`px-3 py-1 text-xs rounded-md flex items-center gap-1 transition-colors ${
                                chartType === label
                                    ? 'bg-accent text-foreground'
                                    : 'text-muted-foreground hover:bg-accent/50'
                            }`}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
                {TIME_RANGES.map(range => (
                    <button
                        key={range.label}
                        onClick={() => setSelectedRange(range)}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                            selectedRange?.label === range.label
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'text-muted-foreground border-border hover:bg-accent'
                        }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </>
    )
}

export default ChartControls

import { useState } from 'react'
import ChartControls from './ChartControls.jsx'
import ChartDisplay from './ChartDisplay.jsx'
import ChartFooter from './ChartFooter.jsx'

const StockChart = ({ chartData, trendColor, symbol, onRangeChange }) => {
    const [chartType, setChartType]         = useState('Area')
    const [selectedRange, setSelectedRange] = useState({ label: '1Y', months: 12 })

    const handleRangeChange = (range) => {
        setSelectedRange(range)
        if (onRangeChange) onRangeChange(range.months)
    }

    return (
        <div className="bg-card rounded-xl border border-border p-4">
            <ChartControls
                symbol={symbol}
                chartType={chartType}
                setChartType={setChartType}
                selectedRange={selectedRange}
                setSelectedRange={handleRangeChange}
            />
            <div className="h-[300px]">
                <ChartDisplay
                    chartData={chartData}
                    trendColor={trendColor}
                    chartType={chartType}
                />
            </div>
            <ChartFooter />
        </div>
    )
}

export default StockChart

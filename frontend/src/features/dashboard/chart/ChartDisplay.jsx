import AreaChart from './AreaChart.jsx'
import CandleChart from './CandleChart.jsx'

const ChartDisplay = ({ chartData, trendColor, chartType }) => {
    if (!chartData?.length) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No chart data available
            </div>
        )
    }

    if (chartType === 'Candlestick') {
        return <CandleChart chartData={chartData} />
    }

    return <AreaChart chartData={chartData} trendColor={trendColor} />
}

export default ChartDisplay

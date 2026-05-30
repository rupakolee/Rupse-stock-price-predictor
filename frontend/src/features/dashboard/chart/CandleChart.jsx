import { useRef, useEffect } from 'react'
import {
    Chart as ChartJS,
    TimeSeriesScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial'

ChartJS.register(TimeSeriesScale, LinearScale, Tooltip, Legend, CandlestickController, CandlestickElement)
const CandleChart = ({ chartData }) => {
    const canvasRef = useRef(null)
    const chartRef  = useRef(null)

    useEffect(() => {
        if (!canvasRef.current || !chartData?.length) return

        const existing = ChartJS.getChart(canvasRef.current)
        if (existing) existing.destroy()
        if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }

        const ctx = canvasRef.current.getContext('2d')

        // chartjs-chart-financial requires x as a timestamp (ms)
        const dataset = chartData.map(d => ({
            x: new Date(d.rawDate || d.time).getTime(),
            o: d.open,
            h: d.high,
            l: d.low,
            c: d.value,
        }))

        chartRef.current = new ChartJS(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: 'OHLC',
                    data:  dataset,
                    color: {
                        up:        '#10b913ff',
                        down:      '#ef4444',
                        unchanged: '#6B7280',
                    },
                }],
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const { o, h, l, c } = ctx.raw
                                return [
                                    `O: $${Number(o).toFixed(2)}`,
                                    `H: $${Number(h).toFixed(2)}`,
                                    `L: $${Number(l).toFixed(2)}`,
                                    `C: $${Number(c).toFixed(2)}`,
                                ]
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        type: 'timeseries',
                        time: { unit: 'month' },
                        ticks: { color: '#6B7280', font: { size: 11 }, maxTicksLimit: 8 },
                        grid:  { display: false },
                    },
                    y: {
                        ticks: { color: '#6B7280', font: { size: 11 }, callback: (v) => `$${Number(v).toFixed(0)}` },
                        grid:  { color: '#6B728020' },
                    },
                },
            },
        })

        return () => {
            if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }
        }
    }, [chartData])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CandleChart

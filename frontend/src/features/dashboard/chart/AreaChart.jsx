import { useRef, useEffect } from 'react'
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler, Tooltip, Legend)

const AreaChart = ({ chartData, trendColor }) => {
    const canvasRef = useRef(null)
    const chartRef  = useRef(null)

    useEffect(() => {
        if (!canvasRef.current) return

        // Destroy any existing chart on this canvas
        const existing = ChartJS.getChart(canvasRef.current)
        if (existing) existing.destroy()
        if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null }

        const ctx = canvasRef.current.getContext('2d')

        chartRef.current = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(d => d.time),
                datasets: [{
                    label:            'Close',
                    data:             chartData.map(d => d.value),
                    borderColor:      trendColor,
                    backgroundColor:  `${trendColor}33`,
                    borderWidth:      2,
                    fill:             true,
                    tension:          0.3,
                    pointRadius:      0,
                    pointHoverRadius: 4,
                }],
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (ctx) => `$${Number(ctx.raw).toFixed(2)}` } },
                },
                scales: {
                    x: {
                        ticks: { maxTicksLimit: 8, maxRotation: 45, color: '#6B7280', font: { size: 11 } },
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
    }, [chartData, trendColor])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default AreaChart

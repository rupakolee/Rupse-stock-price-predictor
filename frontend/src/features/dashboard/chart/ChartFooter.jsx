import { useEffect, useState } from 'react'

const LiveClock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <span>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
    )
}

const ChartFooter = () => {
    return (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Stock</span>
            <span>•</span>
            <LiveClock />
        </div>
    )
}

export default ChartFooter

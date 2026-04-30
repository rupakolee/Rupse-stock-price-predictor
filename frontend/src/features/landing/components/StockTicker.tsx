import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changesPercentage: number;
}

const StockTicker: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const staticGainers: Stock[] = [
        { symbol: "AAPL", name: "Apple Inc.", change: 3.45, price: 186.54, changesPercentage: 1.89 },
        { symbol: "TSLA", name: "Tesla Inc.", change: 4.23, price: 722.21, changesPercentage: 2.15 },
        { symbol: "AMZN", name: "Amazon.com Inc.", change: 2.76, price: 3254.56, changesPercentage: 0.85 },
        { symbol: "MSFT", name: "Microsoft Corp.", change: 1.34, price: 299.31, changesPercentage: 0.45 },
        { symbol: "NVDA", name: "NVIDIA Corporation", change: 5.82, price: 534.12, changesPercentage: 3.15 },
    ];

    const staticLosers: Stock[] = [
        { symbol: "NFLX", name: "Netflix Inc.", change: -6.12, price: 482.65, changesPercentage: -2.35 },
        { symbol: "META", name: "Meta Platforms Inc.", change: -3.41, price: 312.44, changesPercentage: -1.08 },
        { symbol: "PYPL", name: "PayPal Holdings Inc.", change: -2.11, price: 187.54, changesPercentage: -1.11 },
        { symbol: "INTC", name: "Intel Corporation", change: -1.76, price: 58.32, changesPercentage: -0.97 },
        { symbol: "ZM", name: "Zoom Video Communications", change: -4.85, price: 92.33, changesPercentage: -3.12 },
    ];

    useEffect(() => {
        const combined = [...staticGainers, ...staticLosers].sort((a, b) => a.name.localeCompare(b.name));
        setStocks(combined);
    }, []);

    const generateChartData = (change: number) => ({
        labels: Array(6).fill(""),
        datasets: [
            {
                data: Array.from({ length: 6 }, (_, i) => i + (Math.random() * Math.abs(change)) / 0.2),
                backgroundColor: change > 0 ? "rgba(0, 255, 163, 0.2)" : "rgba(255, 77, 77, 0.2)",
                borderColor: change > 0 ? "#00FFA3" : "#FF4D4D",
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: { display: false },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    const scroll = (direction: "left" | "right") => {
        const { current } = scrollRef;
        if (current) {
            current.scrollBy({
                left: direction === "left" ? -220 : 220,
                behavior: "smooth",
            });
        }
    };

    const renderCard = (stock: Stock, idx: number) => {
        const isPositive = stock.change > 0;
        return (
            <div
                key={`${stock.symbol}-${idx}`}
                className={`flex items-center justify-between bg-card rounded-xl p-4 w-56 flex-shrink-0 border ${
                    isPositive ? "border-primary/20" : "border-destructive/20"
                } hover:border-primary/40 transition-colors`}
            >
                <div>
                    <div className="text-sm font-medium text-foreground mb-1">{stock.symbol}</div>
                    <div className="text-muted-foreground text-sm mb-1">${stock.price.toLocaleString()}</div>
                    <div
                        className={`text-xs font-semibold ${
                            isPositive ? "text-primary" : "text-destructive"
                        }`}
                    >
                        {isPositive ? "+" : ""}
                        {stock.change.toFixed(2)} ({stock.changesPercentage.toFixed(2)}%)
                    </div>
                </div>
                <div className="w-20 h-10 ml-2 relative">
                    <Line data={generateChartData(stock.change)} options={chartOptions as any} />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-background py-16 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        Top Stocks in the Market
                        <span className="text-muted-foreground text-xs font-normal">
                             (Closes Soon: 1H 15M)
                        </span>
                    </div>
                    <a href="/market-activity" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                        View Market Activity <span>↗</span>
                    </a>
                </div>

                <div className="relative group">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={20} className="text-foreground" />
                    </Button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-4"
                    >
                        {stocks.map(renderCard)}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={20} className="text-foreground" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StockTicker;




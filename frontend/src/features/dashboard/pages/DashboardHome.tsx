import React from 'react'

const DashboardHome = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight">Overview</h2>
                <p className="opacity-80 text-sm">Monitor your real-time market performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-4 rounded-xl shadow-sm border-none">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Total Assets</h3>
                    <div className="text-xl font-bold text-foreground">$124,500.00</div>
                    <div className="text-xs text-primary mt-2">+12.5% vs last month</div>
                </div>
                <div className="bg-card p-4 rounded-xl shadow-sm border-none">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Daily Profit</h3>
                    <div className="text-xl font-bold text-primary">+$1,240.50</div>
                    <div className="text-xs text-muted-foreground mt-2">Active trades: 4</div>
                </div>
                <div className="bg-card p-4 rounded-xl shadow-sm border-none">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Market Sentiment</h3>
                    <div className="text-xl font-bold text-foreground">Bullish</div>
                    <div className="text-xs text-muted-foreground mt-2">AI Confidence: 88%</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;


const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Market Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to your stock portfolio analysis.</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
            JD
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Total Balance</h3>
            <div className="text-2xl font-bold">$12,450.80</div>
            <div className="text-xs text-primary mt-2">+2.4% from last week</div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Active Positions</h3>
            <div className="text-2xl font-bold">14</div>
            <div className="text-xs text-primary mt-2">3 symbols performing well</div>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Market Sentiment</h3>
            <div className="text-2xl font-bold">Bullish</div>
            <div className="text-xs text-muted-foreground mt-2">Based on latest 24h data</div>
          </div>
        </div>

        <div className="mt-12 p-12 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
            <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Portfolio Performance</h2>
            <p className="text-muted-foreground max-w-md">Your portfolio is performing better than 85% of other traders this month. Keep it up!</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

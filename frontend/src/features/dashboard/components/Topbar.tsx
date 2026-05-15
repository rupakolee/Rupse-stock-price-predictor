import React from 'react'

const Topbar = () => {
    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
            <h1 className="font-semibold tracking-tight text-foreground">Dashboard</h1>

            <div className="flex items-center gap-4">
                {/* profile / logout later */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-border">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">AA</div>
                    <span className="text-xs font-medium text-foreground">User</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;

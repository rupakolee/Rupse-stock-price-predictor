import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Home, ServerCrash, Cpu } from 'lucide-react'

/**
 * ServerError Component
 * A premium 500 Internal Server Error page.
 * Uses a technical/maintenance aesthetic with amber warning tones.
 */
const ServerError = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
            {/* ─── Background Aesthetic Elements ─── */}
            {/* Amber warning glow - Top Left */}
            <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            {/* Deep shadow - Bottom Right */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] animate-pulse delay-700 pointer-events-none" />
            
            {/* Circuit-like Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(currentColor_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="z-10 text-center max-w-2xl w-full flex flex-col items-center">
                {/* ─── Server Crash Icon Layout ─── */}
                <div className="relative mb-12 group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 relative overflow-hidden transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 shadow-2xl shadow-amber-500/5">
                        <ServerCrash className="w-16 h-16 md:w-20 md:h-20 text-amber-500 transition-transform duration-500 group-hover:animate-bounce" />
                        
                        {/* Glitch-like line */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-amber-500/10 to-transparent w-full h-full -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                    
                    {/* Floating Component Icon */}
                    <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-background border border-border shadow-2xl flex items-center justify-center text-amber-500 group-hover:-rotate-12 transition-transform duration-500">
                        <Cpu className="w-7 h-7" />
                    </div>
                </div>
                
                {/* ─── Message Content ─── */}
                <div className="mb-12 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                        System Disruption detected
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
                        500 <span className="text-amber-500">Internal Error</span>
                    </h1>
                    
                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                            Server Nodes are Desynchronized
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                            The central processing unit encountered an unexpected state. Our engineers are currently recalibrating the data stream.
                        </p>
                    </div>
                </div>

                {/* ─── Action Buttons ─── */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-accent text-foreground font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 group"
                    >
                        <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
                        Retry Sync
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] shadow-xl shadow-primary/20"
                    >
                        <Home className="w-5 h-5" />
                        Back to Hub
                    </button>
                </div>
            </div>

            {/* ─── Bottom System Log Decor ─── */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-center opacity-30 hidden md:flex">
                <div className="flex gap-12 text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="flex items-center gap-2 underline decoration-amber-500/50 underline-offset-4">LOG_LEVEL: CRITICAL</span>
                    <span className="flex items-center gap-2">CORE_TEMP: 88°C</span>
                    <span className="flex items-center gap-2">MEMORY_DUMP: ACTIVE</span>
                </div>
            </div>
        </div>
    )
}

export default ServerError

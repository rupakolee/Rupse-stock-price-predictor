import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

/**
 * PageNotFound Component
 * A premium 404 page designed for a high-end finance/stock platform.
 * Features background animations, gradient typography, and intuitive navigation.
 */
const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
            {/* ─── Background Aesthetic Elements ─── */}
            {/* Soft ambient glow - Top Left */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            {/* Soft ambient glow - Bottom Right */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none" />
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="z-10 text-center max-w-2xl w-full flex flex-col items-center">
                {/* ─── 404 Large Header ─── */}
                <div className="relative group">
                    <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-primary via-primary/70 to-primary/10 select-none transition-all duration-700 group-hover:scale-[1.02]">
                        404
                    </h1>
                    {/* Subtle reflection effect */}
                    <div className="absolute -bottom-8 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent opacity-40 blur-xl pointer-events-none" />
                </div>
                
                {/* ─── Message Content ─── */}
                <div className="mt-[-1rem] mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                        Oops! You've drifted off chart.
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                        The page you are looking for doesn't exist. Maybe it was liquidated or moved to a different index.
                    </p>
                </div>

                {/* ─── Action Buttons ─── */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-accent text-foreground font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 group border-white/5"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] shadow-xl shadow-primary/20"
                    >
                        <Home className="w-5 h-5" />
                        Return Home
                    </button>
                </div>
            </div>

            {/* ─── Bottom Status Bar Decor ─── */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-20 hidden md:flex">
                <div className="flex gap-8 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    <span>Code: ERR_NOT_FOUND</span>
                    <span>Status: Disconnected</span>
                    <span>Route: Unknown</span>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound
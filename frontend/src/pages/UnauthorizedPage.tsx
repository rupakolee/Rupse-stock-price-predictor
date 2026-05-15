import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react'

/**
 * UnauthorizedPage Component
 * A premium 403 Access Denied page for restricted areas of the stock platform.
 * Features a secure/locked aesthetic with warning tones.
 */
const UnauthorizedPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background overflow-hidden relative">
            {/* ─── Background Aesthetic Elements ─── */}
            {/* Warm/Warning ambient glow - Top Right */}
            <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-destructive/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            {/* Subtle primary glow - Bottom Left */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] animate-pulse delay-700 pointer-events-none" />
            
            {/* Dot Pattern Overlay for a "Secure Ledger" feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="z-10 text-center max-w-2xl w-full flex flex-col items-center">
                {/* ─── Unauthorized Icon Layout ─── */}
                <div className="relative mb-12 group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-destructive/10 flex items-center justify-center border border-destructive/20 relative overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-destructive/40 shadow-2xl shadow-destructive/5">
                        <Lock className="w-16 h-16 md:w-20 md:h-20 text-destructive transition-transform duration-500 group-hover:scale-110" />
                        
                        {/* Scanning bar effect */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-destructive/40 shadow-[0_0_15px_rgba(var(--destructive),0.5)] animate-[bounce_3s_infinite] pointer-events-none" />
                    </div>
                    
                    {/* Warning badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-background border border-border shadow-2xl flex items-center justify-center text-destructive group-hover:rotate-12 transition-transform duration-500">
                        <ShieldAlert className="w-6 h-6 animate-pulse" />
                    </div>
                </div>
                
                {/* ─── Message Content ─── */}
                <div className="mb-12 space-y-5">
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase flex items-center justify-center gap-3">
                        403 <span className="w-[2px] h-10 bg-border hidden md:block"></span> <span className="text-destructive">Unauthorized</span>
                    </h1>
                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                            Insufficient Permissions Detected
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                            Your account clearance does not allow access to this encrypted terminal. Authentication keys missing or expired.
                        </p>
                    </div>
                    
                    {/* Simulated terminal message */}
                    <div className="bg-card/30 border border-border/50 rounded-lg p-3 inline-block mx-auto backdrop-blur-xs">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-4">
                            Log ID: 0xFD-822-ERR | Level: Restricted
                        </p>
                    </div>
                </div>

                {/* ─── Action Buttons ─── */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-accent text-foreground font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Revert Path
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] shadow-xl shadow-primary/20"
                    >
                        <Home className="w-5 h-5" />
                        Command Center
                    </button>
                </div>
            </div>

            {/* ─── Bottom Security Protocol Decor ─── */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end opacity-30 hidden md:flex">
                <div className="space-y-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    <p className="flex items-center gap-2"><span className="w-1 h-1 bg-destructive rounded-full"></span> Secure Node: 771-A</p>
                    <p className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span> Protocol: OMEGA-0</p>
                </div>
                <div className="space-y-1 text-right text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    <p>Encryption: AES-256 ACTIVE</p>
                    <p>Status: RESTRICTED ACCESS</p>
                </div>
            </div>
        </div>
    )
}

export default UnauthorizedPage
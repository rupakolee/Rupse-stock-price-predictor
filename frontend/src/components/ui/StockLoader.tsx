import React from "react"
import { cn } from "@/lib/utils"

interface StockLoaderProps {
  className?: string
}

export const StockLoader: React.FC<StockLoaderProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 bg-card/40 backdrop-blur-md border border-border/40 rounded-xl shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-4 h-16 justify-center">
        <div className="flex flex-col items-center h-full justify-center relative w-4">
          <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-500/40"></div>
          <div className="w-full bg-emerald-500 rounded-[2px] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{
              height: "40%",
              animationDuration: "1.2s",
              animationDelay: "0.1s"
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center h-full justify-center relative w-4">
          <div className="absolute top-0 bottom-0 w-[2px] bg-red-500/40"></div>
          <div className="w-full bg-red-500 rounded-[2px] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            style={{
              height: "60%",
              animationDuration: "1.5s",
              animationDelay: "0.4s"
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center h-full justify-center relative w-4">
          <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-500/40"></div>
          <div className="w-full bg-emerald-500 rounded-[2px] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{
              height: "30%",
              animationDuration: "1s",
              animationDelay: "0.2s"
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center h-full justify-center relative w-4">
          <div className="absolute top-0 bottom-0 w-[2px] bg-red-500/40"></div>
          <div className="w-full bg-red-500 rounded-[2px] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            style={{
              height: "50%",
              animationDuration: "1.3s",
              animationDelay: "0.6s"
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default StockLoader

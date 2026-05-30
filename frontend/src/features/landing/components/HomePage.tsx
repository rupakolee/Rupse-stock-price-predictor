import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import heroImage from "../../../assets/heroImage.png";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-slate-900 to-slate-800 opacity-95" />

            <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: Copy */}
                    <div className="text-left pr-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                            Invest Smarter with <span className="text-primary">AI</span> & Real-World Signals
                        </h1>
                        <p className="mt-6 text-lg text-slate-300 max-w-prose">
                            Blend price data with alternative signals — news sentiment, web traffic, and analyst
                            signals — to discover actionable opportunities faster.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="rounded-lg font-semibold"
                                type="button"
                                onClick={() => navigate(ROUTES.PREDICTIONS)}
                            >
                                Try Demo
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                className="rounded-lg text-slate-200 border border-slate-700"
                                type="button"
                                onClick={() => {
                                    const el = document.getElementById("features");
                                    if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    } else {
                                        navigate(ROUTES.HOME);
                                    }
                                }}
                            >
                                Explore Data
                            </Button>
                        </div>

                   
                    </div>

                    {/* Right: Visual cards stack */}
                    <div className="relative flex justify-center md:justify-end">
                        <div className="w-full max-w-md">
                            <div className="transform -rotate-3 shadow-2xl rounded-xl overflow-hidden border border-slate-700">
                                <img src={heroImage} alt="Dashboard" className="w-full object-cover h-64 md:h-72" />
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-card/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-md">
                                    <div className="text-xs text-slate-300">AAPL · Prediction</div>
                                    <div className="mt-2 text-lg font-bold text-white">+3.2%</div>
                                    <div className="mt-1 text-sm text-slate-400">Confidence 78%</div>
                                </div>
                                <div className="bg-card/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-md">
                                    <div className="text-xs text-slate-300">SPOT · Signals</div>
                                    <div className="mt-2 text-lg font-bold text-white">Bullish</div>
                                    <div className="mt-1 text-sm text-slate-400">Mentions +42% this week</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* decorative blobs */}
            <svg className="pointer-events-none absolute right-0 top-0 -translate-y-1/3 opacity-20" width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="210" cy="210" r="180" fill="url(#g1)" />
                <defs>
                    <radialGradient id="g1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(210 210) rotate(90) scale(180)">
                        <stop stopColor="#00FFA3" stopOpacity="0.12" />
                        <stop offset="1" stopColor="#00A3FF" stopOpacity="0.04" />
                    </radialGradient>
                </defs>
            </svg>
        </section>
    );
};

export default HomePage;

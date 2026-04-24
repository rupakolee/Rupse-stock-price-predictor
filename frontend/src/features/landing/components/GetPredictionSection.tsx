import React from "react";
import getPredictionImage1 from "../../../assets/prediction1.jpg";
import getPredictionImage2 from "../../../assets/prediction2.jpg";

const GetPredictionSection: React.FC = () => {
    return (
        <section className="bg-background py-24 px-6 text-foreground relative border-t border-border/30">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                {/* Left: Dual Images with overlapping effect */}
                <div className="flex gap-4 w-full lg:w-1/2 justify-center relative">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />

                    {/* First Image */}
                    <div className="relative w-[240px] md:w-[270px] h-[360px] md:h-[410px] rounded-2xl overflow-hidden border border-border shadow-2xl">
                        <img
                            src={getPredictionImage1}
                            alt="Prediction Dashboard Analysis"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                    </div>

                    {/* Second Image (Offset) */}
                    <div className="relative w-[240px] md:w-[270px] h-[360px] md:h-[410px] rounded-2xl overflow-hidden mt-16 md:mt-20 border border-border shadow-2xl -ml-12 md:-ml-16">
                        <img
                            src={getPredictionImage2}
                            alt="Predictive Market Trends"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                    </div>
                </div>

                {/* Right: Text + CTA */}
                <div className="w-full lg:w-1/2 text-left">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        AI-Powered Forecasting
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-[1.1]">
                        Predict Smarter, <br /><span className="text-primary">Invest Better</span>
                    </h2>
                    <p className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-lg">
                        Utilize the power of AI to generate predictions based on real-time and
                        alternative market data. Gain the edge you need to make timely, confident
                        decisions before the market reacts.
                    </p>
                    <a
                        href="/stock-prediction"
                        className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-base px-8 py-4 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all"
                    >
                        Get Prediction Now <span className="ml-2">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GetPredictionSection;

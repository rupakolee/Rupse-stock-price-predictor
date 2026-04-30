import React from "react";
import heroImage from "../../../assets/heroImage.png";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center py-20 gap-14">
            {/* Text Content */}
            <div className="max-w-xl text-left">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
                    Make <span className="text-primary">Better</span> Investment Decisions With{" "}
                    <span className="text-primary">Alternative</span> Data
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">
                    Unlock deep market insights using our AI-driven analysis of alternative data sources.
                </p>
                <div className="mt-10">
                    <Button size="lg" className="rounded-lg font-semibold">
                        Get Started
                    </Button>
                </div>
            </div>

            {/* Image + Visual Effects */}
            <div className="relative mt-10 md:mt-0">
                {/* Decorative Gradients */}
                <div className="absolute top-[-10%] left-[-10%] h-32 w-32 rounded-full z-20 bg-primary/20 backdrop-blur-[4px] shadow-lg animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] h-24 w-24 rounded-full z-20 bg-foreground/10 backdrop-blur-[4px] shadow-lg" />

                {/* Background Shadow/Glow */}
                <img
                    src={heroImage}
                    alt="Hero Visual Backdrop"
                    className="w-full max-w-md md:max-w-xl object-cover absolute z-0 rounded-xl inset-0 left-10 top-10 blur-xl opacity-30"
                />

                {/* Main Hero Image */}
                <div className="relative z-10 rounded-xl overflow-hidden border border-border">
                    <img
                        src={heroImage}
                        alt="Stock Analysis Dashboard"
                        className="w-full max-w-md md:max-w-xl object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default HomePage;

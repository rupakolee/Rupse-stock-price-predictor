import React from "react";
import {
  BarChart3,
  Globe,
  CalendarDays,
  BellRing,
  Smartphone,
} from "lucide-react";

interface Feature {
  icon: React.ReactElement;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    title: "AI-Powered Forecasts",
    desc: "Real-time predictions with high accuracy using state-of-the-art models.",
  },
  {
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: "Alternative Data Integration",
    desc: "Sentiment analysis, social trends, and non-traditional market signals.",
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-primary" />,
    title: "Daily Market Insights",
    desc: "Stay updated with comprehensive analysis of top gainers and losers.",
  },
  {
    icon: <BellRing className="w-6 h-6 text-primary" />,
    title: "Smart Alerts",
    desc: "Get instantly notified when market conditions meet your specific criteria.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    title: "Mobile-Ready Dashboard",
    desc: "Trade and track your portfolio on the go with our responsive interface.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-background py-24 px-6 text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features at Your Fingertips</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make smarter investment decisions, powered by AI and real-time data.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={`${feature.title}-${index}`}
              className="group bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-[0_0_30px_rgba(0,255,163,0.1)] transition-all duration-300"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

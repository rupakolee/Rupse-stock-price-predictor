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
    <section id="features" className="py-20 px-6 text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">What you get</h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-slate-400 max-w-2xl mx-auto">
            Seamless predictions, clear signals, and real-time alerts — all in one elegant dashboard.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={`${feature.title}-${index}`}
              className="group bg-gradient-to-b from-slate-800/60 to-slate-800/40 rounded-2xl p-6 border border-slate-700 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

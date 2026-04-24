import React from "react";
import { Search, BrainCircuit, TrendingUp, Briefcase } from "lucide-react";

interface Step {
  icon: React.ReactElement;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    icon: <Search className="w-6 h-6 text-primary" />,
    title: "Analyze Trends",
    desc: "Our AI scans vast market and alternative data sources automatically.",
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-primary" />,
    title: "Predict Prices",
    desc: "Advanced ML models forecast future stock movements with precision.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: "Informed Decisions",
    desc: "Access verified predictions to trade with maximum confidence.",
  },
  {
    icon: <Briefcase className="w-6 h-6 text-primary" />,
    title: "Track Portfolio",
    desc: "Monitor real-time performance and refine your strategies.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-background py-24 px-6 text-foreground border-t border-border/50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <div className="h-1 w-20 bg-primary mx-auto mb-12 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative group"
            >
              {/* Step Number Badge */}
              <div className="absolute top-4 right-4 text-4xl font-black text-foreground/5 group-hover:text-primary/10 transition-colors">
                {index + 1}
              </div>
              
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

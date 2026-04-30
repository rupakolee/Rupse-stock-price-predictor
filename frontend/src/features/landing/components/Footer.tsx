import React from "react";
import { Button } from "@/components/ui/button";
// import {
//   Facebook,
//   Twitter,
//   Linkedin,
//   Github,
// } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-card text-foreground py-20 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand + Description */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-primary">NuroStock</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            State-of-the-art AI-powered stock forecasting tool that empowers your investment journey with precision and confidence.
          </p>
          {/* <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" aria-label="GitHub"><Github size={20} /></a>
          </div> */}
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h3 className="text-base font-bold">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/stock-prediction" className="hover:text-primary transition-colors">Stock Prediction</a></li>
              <li><a href="/login" className="hover:text-primary transition-colors">Login</a></li>
              <li><a href="/register" className="hover:text-primary transition-colors">Register</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/market-activity" className="hover:text-primary transition-colors">Market Activity</a></li>
              <li><a href="/portfolio" className="hover:text-primary transition-colors">Portfolio</a></li>
              <li><a href="/watchlist" className="hover:text-primary transition-colors">Watchlist</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-4">
          <h3 className="text-base font-bold">Stay Updated</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get the latest market tips and AI predictions delivered directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2.5 rounded-xl bg-background text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div>
          © 2025 <span className="text-primary font-bold">NuroStock</span>. Empowering traders everywhere.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

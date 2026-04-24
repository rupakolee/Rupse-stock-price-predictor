
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import StockTicker from "./components/StockTicker";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import GetPredictionSection from "./components/GetPredictionSection";
import Footer from "./components/Footer";

const Landing: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-grow">
                <HomePage />
                <StockTicker />
                <FeaturesSection />
                <HowItWorks />
                <GetPredictionSection />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;

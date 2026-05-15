import axios from "axios";
import StockData from "../model/market.model.js"

const ONE_DAY = 1000 * 60 * 60 * 24;

const fetchHistoricalDataFromAPI = async (req, res) => {
    const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

    try {
        const symbol = req.params.symbol?.trim().toUpperCase();

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: "Symbol is required",
                data: null,
                timestamp: new Date().toISOString(),
            });
        }


        const cached = await StockData.findOne({ ticker: symbol });
        const isFresh = cached && (Date.now() - new Date(cached.updatedAt).getTime() < ONE_DAY);


        if (isFresh) {
            return res.status(200).json({
                success: true,
                message: "Market data fetched successfully",
                data: cached.raw,
                timestamp: new Date().toISOString(),
            });
        }

        const response = await axios.get("https://api.twelvedata.com/time_series", {
            params: {
                symbol: symbol,
                interval: "1day",
                apikey: TWELVE_DATA_API_KEY,
            },
        });

        const apiData = response?.data;

        if (!apiData || apiData.status === "error") {
            return res.status(404).json({
                error: apiData?.message || "No data found"
            });
        }

        const saved = await StockData.findOneAndUpdate(
            { ticker: symbol },
            {
                raw: apiData,
                updatedAt: Date.now()
            },
            { upsert: true, returnDocument: "after" }
        );

        return res.status(200).json(
            {
                success: true,
                message: "Market data fetched successfully",
                data: saved.raw,
                timestamp: new Date().toDateString(),
            }
        );

    } catch (error) {
        console.error("Market data fetch error:", error.message);
        return res.status(500).json({ error: "Failed to fetch market data" });
    }
};

export default fetchHistoricalDataFromAPI;

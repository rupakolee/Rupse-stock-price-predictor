import axios from "axios";
import StockData from "../model/market.model.js";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const isCacheFresh = (cached) => {
    if (!cached?.raw?.values?.length) return false;
    const latestDate = cached.raw.values[0]?.datetime?.split(" ")[0];
    return latestDate === getTodayDate();
};

const fetchHistoricalDataFromAPI = async (req, res) => {
    try {
        const symbol    = req.params.symbol?.trim().toUpperCase();
        const startDate = req.query.start_date || "2021-01-01";
        const endDate   = req.query.end_date   || getTodayDate();

        if (!symbol) {
            return res.status(400).json({
                success:   false,
                message:   "Symbol is required",
                data:      null,
                timestamp: new Date().toISOString(),
            });
        }

        const cached = await StockData.findOne({ ticker: symbol });

        // If cached data is fresh, return it immediately
        if (isCacheFresh(cached)) {
            return res.status(200).json({
                success:   true,
                message:   "Market data fetched successfully (from cache)",
                data: {
                    meta:   cached.raw.meta,
                    values: cached.raw.values,
                },
                timestamp: new Date().toISOString(),
            });
        }

        // If Twelve Data API key is not configured, try to return stale cache if available
        const apiKey = process.env.TWELVE_DATA_API_KEY;
        if (!apiKey) {
            if (cached && cached.raw && cached.raw.values?.length) {
                console.warn("TWELVE_DATA_API_KEY not set — returning stale cached market data");
                return res.status(200).json({
                    success: true,
                    message: "Market data fetched from cache (API key not configured)",
                    data: {
                        meta: cached.raw.meta,
                        values: cached.raw.values,
                    },
                    timestamp: new Date().toISOString(),
                });
            }

            return res.status(500).json({
                success:   false,
                message:   "Server misconfiguration: TWELVE_DATA_API_KEY is not set",
                data:      null,
                timestamp: new Date().toISOString(),
            });
        }

        const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&start_date=${startDate}&end_date=${endDate}&apikey=${apiKey}`;

        const response = await axios.get(url);
        const apiData  = response?.data;

        console.log("status:", apiData?.status);
        console.log("values count:", apiData?.values?.length);

        if (!apiData || apiData.status === "error") {
            return res.status(404).json({
                success:   false,
                message:   apiData?.message || "No data found for this symbol",
                data:      null,
                timestamp: new Date().toISOString(),
            });
        }

        const saved = await StockData.findOneAndUpdate(
            { ticker: symbol },
            { raw: apiData, updatedAt: Date.now() },
            { upsert: true, returnDocument: "after" }
        );

        return res.status(200).json({
            success:   true,
            message:   "Market data fetched successfully",
            data: {
                meta:   saved.raw.meta,
                values: saved.raw.values,
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error("Market data fetch error:", error);
        return res.status(500).json({
            success:   false,
            message:   "Failed to fetch market data",
            data:      null,
            timestamp: new Date().toISOString(),
        });
    }
};

export default fetchHistoricalDataFromAPI;

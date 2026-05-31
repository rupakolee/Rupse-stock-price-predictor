import axios from "axios";
import Fundamental from "../model/fundamental.model.js";

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90;
export const fetchFundamental = async (req, res) => {
  const API_URL = process.env.FUNDAMENTAL_API_URL || "https://www.alphavantage.co/query";
  const API_KEY = process.env.TWELVE_DATA_API_KEY;

  const symbol = req.params?.symbol?.trim()?.toUpperCase();

  // console.log("Raw symbol", JSON.stringify(symbol));

  if (!symbol) {
    return res.status(400).json({
      error: "Symbol is required",
    });
  }

  try {
    const cachedData = await Fundamental.findOne({
      symbol: symbol.toUpperCase(),
    });

    const isFresh =
      cachedData &&
      Date.now() - new Date(cachedData.lastUpdated).getTime() < THREE_MONTHS;

    if (isFresh) {
      return res.status(200).json({
        success: true,
        message: "Company overview data fetched successfully",
        data: cachedData.data,
        timestamp: new Date().toISOString(),
      });
    }

    if (!API_KEY) {
      if (cachedData?.data) {
        return res.status(200).json({
          success: true,
          message: "Company overview data fetched from cache (API key not configured)",
          data: cachedData.data,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(500).json({
        success: false,
        error: "Server misconfiguration: TWELVE_DATA_API_KEY is not set",
      });
    }

    const response = await axios.get(API_URL, {
      params: {
        function: "OVERVIEW",
        symbol: symbol,
        apikey: API_KEY,
      },
    });

    const apiData = response.data;

    if (!apiData || !apiData.Symbol) {
      return res.status(404).json({
        error: "No data found for this symbol",
      });
    }

    const updateDoc = await Fundamental.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      { data: apiData, lastUpdated: Date.now() },
      { returnDocument: "after", upsert: true },
    );

    res.status(200).json({
      success: true,
      message: "Company overview data fetched successfully",
      data: updateDoc.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch company overview data",
    });
  }
};

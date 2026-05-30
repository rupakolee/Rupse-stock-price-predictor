import axios from "axios";
import Fundamental from "../model/fundamental.model.js";

const THREE_MONTHS = 1000 * 60 * 60 * 24 * 90;
export const fetchFundamental = async (req, res) => {
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;

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

    const response = await axios.get(API_URL, {
      params: {
        function: "OVERVIEW",
        symbol: symbol,
        apikey: API_KEY,
      },
    });

    const apiData = response.data;

    if (!apiData.Symbol) {
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

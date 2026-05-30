import type { MarketData } from "@/types/market";
import { API_ENDPOINTS } from "@/constant/constant";
import { createApiConfig } from "../config/Api-config";

const marketApi = createApiConfig<MarketData>(
    API_ENDPOINTS.MARKET, 
    "Market"
);

export const useGetMarketDataByTicker = marketApi.useGetBySymbol;

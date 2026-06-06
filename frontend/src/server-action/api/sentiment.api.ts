import { createApiConfig } from "../config/Api-config";
import type { SentimentData } from "@/types/sentiment";
import { API_ENDPOINTS } from "@/constant/constant";

const sentimentApi = createApiConfig<SentimentData>(
    API_ENDPOINTS.SENTIMENT,
    "Sentiment"
);

export const useGetSentimentByTicker = sentimentApi.useGetBySymbol;

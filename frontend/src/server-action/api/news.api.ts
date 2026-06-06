import { createApiConfig } from "../config/Api-config";
import type { NewsData } from "@/types/news";
import { API_ENDPOINTS } from "@/constant/constant";

const newsApi = createApiConfig<NewsData>(
    API_ENDPOINTS.NEWS,
    "News"
);

export const useGetNewsByTicker = newsApi.useGetBySymbol;

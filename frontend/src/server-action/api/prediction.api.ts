import { API_ENDPOINTS } from "@/constant/constant";
import type { PredictionData } from "@/types/prediction";
import { createApiConfig } from "../config/Api-config";

const predictionApi = createApiConfig<PredictionData>(
    API_ENDPOINTS.PREDICTION,
    "Prediction"
);

export const useGetPredictionByTicker = predictionApi.useGetBySymbol;
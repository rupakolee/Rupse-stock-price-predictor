import type { FundamentalData } from "@/types/fundamental";
import { API_ENDPOINTS } from "@/constant/constant";
import { createApiConfig } from "../config/Api-config";

const fundamentalApi = createApiConfig<FundamentalData>(
    API_ENDPOINTS.FUNDAMENTAL,
    "Fundamental"
);

export const useGetFundamentalByTicker = fundamentalApi.useGetBySymbol;

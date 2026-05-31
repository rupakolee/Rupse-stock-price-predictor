
export const API_ENDPOINTS = {
  FUNDAMENTAL: "fundamental",
  PREDICTION: "prediction",
  MARKET:"market",

} as const;

export const USER_ROLE ={
  ADMIN: "admin",
  USER: "user",
}

export const TOKEN_KEY = "token";
export const USER_KEY = "user";


// Use these in useQuery / queryClient.invalidateQueries to avoid typos
export const QUERY_KEYS = {
  AUTH: "auth",
  PERMISSIONS: "permissions",
  STOCK_HISTORY: "stock-history",
  STOCK_PREDICT: "stock-predict",
} as const;



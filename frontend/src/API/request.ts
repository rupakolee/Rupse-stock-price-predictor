import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { TOKEN_KEY, USER_KEY } from "@/constant/constant";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface ApiErrorResponse {
  message?: string;
  error?: Array<{ message: string }>;
}

// ─────────────────────────────────────────────
//  Single Axios Instance
//  All API calls in the app go through this.
//  Import this in query.ts, mutation.ts, and Api-config.ts
// ─────────────────────────────────────────────
 console.log(";fasd",import.meta.env.VITE_API_BASE_URL,)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────
//  Duplicate-request cancellation map
// ─────────────────────────────────────────────
const controllers = new Map<string, AbortController>();

function makeRequestKey(config: InternalAxiosRequestConfig): string {
  return `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(
    config.params ?? {}
  )}`;
}

function extractErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  return (
    error?.response?.data?.error?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred"
  );
}

// ─────────────────────────────────────────────
//  Request Interceptor
// ─────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Dynamic Content-Type
    if (config.data instanceof FormData) {
      // Let browser set the correct multipart boundary
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    // Cancel duplicate in-flight requests
    const key = makeRequestKey(config);
    controllers.get(key)?.abort();
    controllers.delete(key);

    const controller = new AbortController();
    config.signal = controller.signal;
    controllers.set(key, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
//  Response Interceptor
// ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const key = makeRequestKey(response.config as InternalAxiosRequestConfig);
    controllers.delete(key);
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Cancelled request — swallow silently
    if (axios.isCancel(error)) return new Promise(() => {});

    if (error.config) {
      const key = makeRequestKey(error.config);
      controllers.delete(key);
    }

    // 401 → clear storage and redirect to login
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = import.meta.env.VITE_LOGIN_ROUTE || "/login";
    }

    return Promise.reject(extractErrorMessage(error));
  }
);

export default apiClient;
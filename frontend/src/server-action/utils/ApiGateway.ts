/**
 * ApiGateway.ts
 *
 * This file is kept for backwards compatibility.
 * The real axios instance now lives in src/API/request.ts.
 *
 * All new code should import from "@/API":
 *   import { apiClient } from "@/API";
 */
export { default as apiClient } from "@/API/request";

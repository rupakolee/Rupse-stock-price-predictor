/**
 * src/API/index.ts — Barrel export for the API layer
 *
 * Import everything from "@/API" in your feature files:
 *
 *   import { useFetchData, useMutationHandler, useDeleteHandler } from "@/API";
 *   import type { UseFetchOptions, MutationHandlerOptions } from "@/API";
 */

// Axios client (use this in Api-config.ts and anywhere you need raw axios)
export { default as apiClient } from "./request";

// Query hook + types
export { default as useFetchData, fetchData } from "./query";
export type { UseFetchOptions } from "./query";

// Mutation hooks + types
export {
  useMutationHandler,
  useDeleteHandler,
  mutateData,
  deleteData,
} from "./mutation";
export type { MutationHandlerOptions } from "./mutation";

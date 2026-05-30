import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import apiClient from "./request";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type QueryKey = readonly (string | number | boolean | null | undefined | object)[];

/**
 * Options you can pass to useFetchData on top of standard TanStack options.
 * Params are sent as query string (e.g. ?page=1&limit=10).
 */
export interface UseFetchOptions<TData>
  extends Omit<UseQueryOptions<TData, string>, "queryKey" | "queryFn"> {
  params?: Record<string, unknown>;
}

// ─────────────────────────────────────────────
//  Raw fetcher (callable outside of React)
// ─────────────────────────────────────────────
export const fetchData = async <TData = unknown>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<TData> => {
  const response = await apiClient.get<{ data: TData }>(endpoint, { params });
  return response.data.data;
};

// ─────────────────────────────────────────────
//  useFetchData — generic typed query hook
//
//  Usage:
//    const { data, isLoading } = useFetchData<StockHistory[]>(
//      ['stock-history', userId],
//      API_ENDPOINTS.STOCK.HISTORY,
//      { params: { userId }, staleTime: 60_000 }
//    );
// ─────────────────────────────────────────────
const useFetchData = <TData = unknown>(
  key: QueryKey,
  endpoint: string,
  options?: UseFetchOptions<TData>
) => {
  const { params, ...queryOptions } = options ?? {};

  return useQuery<TData, string>({
    queryKey: key,
    queryFn: () => fetchData<TData>(endpoint, params),
    refetchOnWindowFocus: false,
    retry: 1,
    ...queryOptions,
  });
};

export default useFetchData;

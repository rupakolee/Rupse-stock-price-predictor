import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "./request";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
type HttpMethod = "POST" | "PUT" | "PATCH";

/**
 * Extra options on top of TanStack's UseMutationOptions.
 * successMessage / errorMessage let callers override default toasts.
 */
export interface MutationHandlerOptions<TData, TVariables>
  extends Omit<
    UseMutationOptions<TData, string, TVariables>,
    "mutationFn" | "onSuccess" | "onError" // omit so we redefine with simpler types
  > {
  successMessage?: string;
  errorMessage?: string;
  /** When true, no toast is shown on success (useful when caller handles it). */
  silentSuccess?: boolean;
  /** When true, no toast is shown on error. */
  silentError?: boolean;
  // Redefined without TanStack v5's 4th `mutation` parameter — callers don't need it
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
  onError?: (error: string, variables: TVariables, context: unknown) => void;
}

// ─────────────────────────────────────────────
//  Raw mutators (callable outside of React)
// ─────────────────────────────────────────────
export const mutateData = async <TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: HttpMethod,
  data: TVariables
): Promise<TData> => {
  const response = await apiClient.request<{ data: TData }>({
    url: endpoint,
    method,
    data,
  });
  return response.data.data;
};

export const deleteData = async <TData = unknown>(
  endpoint: string,
  id: string | number
): Promise<TData> => {
  const response = await apiClient.delete<{ data: TData }>(`${endpoint}/${id}`);
  return response.data.data;
};

// ─────────────────────────────────────────────
//  useMutationHandler — typed create / update hook
//
//  Usage:
//    const { mutate, isPending } = useMutationHandler<AuthData, LoginPayload>(
//      API_ENDPOINTS.AUTH.LOGIN,
//      'POST',
//      {
//        successMessage: 'Login successful!',
//        onSuccess: (data) => { ... }
//      }
//    );
// ─────────────────────────────────────────────
export const useMutationHandler = <TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: HttpMethod = "POST",
  options?: MutationHandlerOptions<TData, TVariables>
) => {
  const {
    successMessage,
    errorMessage,
    silentSuccess = false,
    silentError = false,
    onSuccess,
    onError,
    ...restOptions
  } = options ?? {};

  return useMutation<TData, string, TVariables>({
    mutationFn: (data) => mutateData<TData, TVariables>(endpoint, method, data),

    onSuccess: (data, variables, context) => {
      if (!silentSuccess) {
        toast.success(successMessage ?? "Operation successful!");
      }
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      if (!silentError) {
        toast.error(errorMessage ?? error ?? "Something went wrong!");
      }
      onError?.(error, variables, context);
    },

    ...restOptions,
  });
};

// ─────────────────────────────────────────────
//  useDeleteHandler — invalidates a query key after delete
//
//  Usage:
//    const { mutate: deleteStock } = useDeleteHandler<Stock>(
//      '/stock',
//      [QUERY_KEYS.STOCK_HISTORY],
//    );
//    deleteStock(stockId);
// ─────────────────────────────────────────────
export const useDeleteHandler = <TData = unknown>(
  endpoint: string,
  queryKey: readonly string[],
  options?: MutationHandlerOptions<TData, string | number>
) => {
  const queryClient = useQueryClient();
  const {
    successMessage,
    errorMessage,
    silentSuccess = false,
    silentError = false,
    onSuccess,
    onError,
    ...restOptions
  } = options ?? {};

  return useMutation<TData, string, string | number>({
    mutationFn: (id) => deleteData<TData>(endpoint, id),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey });
      if (!silentSuccess) {
        toast.success(successMessage ?? "Item deleted successfully!");
      }
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      if (!silentError) {
        toast.error(errorMessage ?? error ?? "Failed to delete item!");
      }
      onError?.(error, variables, context);
    },

    ...restOptions,
  });
};

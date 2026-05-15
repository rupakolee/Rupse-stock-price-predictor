/**
 * auth.api.ts
 * 
 * Defines exact request/response types for authentication.
 * Uses TanStack Query mutations to update the global auth state.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { mutateData } from "@/API/mutation";
import { API_ENDPOINTS, QUERY_KEYS, TOKEN_KEY, USER_KEY } from "@/constant/constant";
import type { AuthData, AuthUser } from "@/hooks/useAuth";
import { MOCK_AUTH } from "@/mocks/auth.mock";

// ─────────────────────────────────────────────
//  1. Request Interfaces (Payloads)
// ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// ─────────────────────────────────────────────
//  2. Response Interfaces
//  The backend is expected to return data in this shape:
//  { data: { token: string, user: AuthUser } }
// ─────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ─────────────────────────────────────────────
//  3. Mutations
// ─────────────────────────────────────────────

/**
 * useLoginMutation
 * Performs POST /auth/login and updates local state on success.
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, string, LoginRequest>({
    mutationFn: async (payload) => {
      // DEV MOCK BYPASS
      if (import.meta.env.VITE_USE_MOCK_AUTH === "true") {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
        return MOCK_AUTH;
      }
      return mutateData<AuthResponse, LoginRequest>(API_ENDPOINTS.AUTH.LOGIN, "POST", payload);
    },

    onSuccess: (data) => {
      // Persist to localStorage for persistence across reloads
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      // Update TanStack Query cache - useAuth() will now return this data
      queryClient.setQueryData<AuthData>([QUERY_KEYS.AUTH], data);

      toast.success("Welcome back!");
    },

    onError: (error) => {
      toast.error(error ?? "Login failed. Please check your credentials.");
    },
  });
};

/**
 * useRegisterMutation
 * Performs POST /auth/register and updates local state on success.
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, string, RegisterRequest>({
    mutationFn: async (payload) => {
      // DEV MOCK BYPASS
      if (import.meta.env.VITE_USE_MOCK_AUTH === "true") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          token: "dev-token",
          user: { id: "1", name: payload.name, email: payload.email, role: "admin" }
        };
      }
      return mutateData<AuthResponse, RegisterRequest>(API_ENDPOINTS.AUTH.REGISTER, "POST", payload);
    },

    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      queryClient.setQueryData<AuthData>([QUERY_KEYS.AUTH], data);
      toast.success("Account created! Welcome aboard.");
    },

    onError: (error) => {
      toast.error(error ?? "Registration failed. Please try again.");
    },
  });
};

/**
 * useLogoutMutation
 * Clears local storage and Query cache.
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, string, void>({
    mutationFn: async () => {
      // Optional: await mutateData(API_ENDPOINTS.AUTH.LOGOUT, "POST", {});
    },

    onSuccess: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Reset cache for auth and permissions
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.AUTH] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.PERMISSIONS] });

      toast.info("You have been logged out.");
    },

    onError: (error) => {
      toast.error(error ?? "Logout failed.");
    },
  });
};


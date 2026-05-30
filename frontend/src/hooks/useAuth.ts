import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constant/constant";

export interface AuthUser {
    id:      string
    name:    string
    email:   string
    role:    string
    isAdmin: boolean
}

export interface AuthData {
    token: string
    user:  AuthUser
}

/**
 * Reads auth state from the TanStack Query cache.
 * AuthProvider seeds this on mount from localStorage.
 * Never makes a network request — enabled: false.
 */
export const useAuth = () => {
    const { data, isLoading } = useQuery<AuthData>({
        queryKey:  [QUERY_KEYS.AUTH],
        queryFn:   () => Promise.resolve(undefined as unknown as AuthData),
        enabled:   false,
        staleTime: Infinity,
        gcTime:    Infinity,
    });

    return {
        data,
        isAuthenticated: !!data?.token,
        user:            data?.user,
        isLoading,
    };
};

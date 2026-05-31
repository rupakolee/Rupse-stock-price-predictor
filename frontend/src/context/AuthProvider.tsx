  import { useEffect, useState } from "react";
  import type { ReactNode } from "react";
  import { useQueryClient } from "@tanstack/react-query";
  import { QUERY_KEYS, TOKEN_KEY, USER_KEY } from "@/constant/constant";import type { AuthData } from "@/hooks/useAuth";

  interface AuthProviderProps {
    children: ReactNode;
  }

  /**
   * AuthProvider
   *
   * Runs once on mount. Reads token + user from localStorage and seeds
   * the TanStack Query cache under QUERY_KEYS.AUTH.
   */
  const AuthProvider = ({ children }: AuthProviderProps) => {
    const queryClient = useQueryClient();
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);

      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          queryClient.setQueryData<AuthData>([QUERY_KEYS.AUTH], { token: token || "", user });
        } catch (e) {
          console.error("[AuthProvider] Failed to parse user from localStorage", e);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }

      setIsAuthReady(true);
    }, [queryClient]);

    // Block render until cache is seeded — prevents flash of unauthenticated content
    if (!isAuthReady) return null;

    return <>{children}</>;
  };

  export default AuthProvider;

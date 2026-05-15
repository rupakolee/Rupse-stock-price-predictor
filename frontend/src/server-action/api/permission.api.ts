import useFetchData from "@/API/query";
import { API_ENDPOINTS, QUERY_KEYS } from "@/constant/constant";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
export interface Permission {
  id: string;
  userId: string;
  role: string;
  canPredict: boolean;
  canViewHistory: boolean;
}

// ─────────────────────────────────────────────
//  useGetPermissionByUserId
//
//  Usage:
//    const { data, isLoading } = useGetPermissionByUserId(user?.id);
// ─────────────────────────────────────────────
export const useGetPermissionByUserId = (userId: string | undefined) => {
  return useFetchData<Permission[]>(
    [QUERY_KEYS.PERMISSIONS, userId],
    `${API_ENDPOINTS.PERMISSION}/${userId}`,
    {
      enabled: !!userId,
      // DEV MOCK BYPASS
      queryFn: async () => {
        if (import.meta.env.VITE_USE_MOCK_AUTH === "true") {
          return [{
            id: "1",
            userId: userId || "1",
            role: "admin",
            canPredict: true,
            canViewHistory: true
          }];
        }
      }
    }
  );
};

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useGetPermissionByUserId } from "../server-action/api/permission.api";

interface PermissionContextType {
    permissions: any;
    isLoading: boolean;
    error: any;
    refetch: () => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
    children: ReactNode;
}

const PermissionProvider = ({ children }: PermissionProviderProps) => {
    const { data } = useAuth();
    const {
        data: permissions,
        isLoading,
        error,
        refetch,
    } = useGetPermissionByUserId(data?.user?.id);

    const permission = permissions?.[0];

    return (
        <PermissionContext.Provider value={{ permissions: permission, isLoading, error, refetch }}>
            {children}
        </PermissionContext.Provider>
    );
};

export default PermissionProvider;

export const usePermissionContext = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermissionContext must be used within a PermissionProvider");
    }
    return context;
};

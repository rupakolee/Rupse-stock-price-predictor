import GlobalLoader from "@/pages/GlobalLoader";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

interface ProtecteRouteProps {
    allowedRoles?: string[];
}


const ProtecteRoute = ({ allowedRoles }: ProtecteRouteProps) => {
    const location = useLocation();

    const { isAuthenticated, userRole, loading } = {
        isAuthenticated: true,
        userRole: "admin",
        loading: false,
    };

    if (loading) return <GlobalLoader />

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (!userRole && !allowedRoles?.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <Outlet />
}

export default ProtecteRoute;
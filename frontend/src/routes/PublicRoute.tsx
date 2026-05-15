import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () => {
    const { isAuthenticated } = {
        isAuthenticated: false
    }
    if (isAuthenticated) return <Navigate to="/dashboard" replace />
    return <Outlet />
}

export default PublicRoute;
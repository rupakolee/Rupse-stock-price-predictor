import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = localStorage.getItem("user");

  if (!user || user === null) {
    return <Navigate to="/login" replace />;
  }

  // if (!allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
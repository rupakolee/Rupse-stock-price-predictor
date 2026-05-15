import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import { USER_ROLE } from "@/constant/constant";
import GlobalLoader from "@/pages/GlobalLoader";
import { ProtectedRoute, PublicRoute } from ".";
import { navConfig } from "@/features/dashboard/navigation/navConfig";

const Landing          = lazy(() => import("@/features/landing").then((m) => ({ default: m.Landing })));
const LoginPage        = lazy(() => import("@/features/auth").then((m) => ({ default: m.LoginPage })));
const RegisterPage     = lazy(() => import("@/features/auth").then((m) => ({ default: m.RegisterPage })));
const DashboardLayout  = lazy(() => import("@/features/dashboard").then((m) => ({ default: m.DashboardLayout })));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));
const PageNotFound     = lazy(() => import("@/pages/PageNotFound"));
const ServerError      = lazy(() => import("@/pages/ServerError"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<GlobalLoader />}>
            <Routes>
                {/* ── Public ── */}
                <Route path={ROUTES.HOME}         element={<Landing />} />
                <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
                <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} />

                {/* ── Guest only ── */}
                <Route element={<PublicRoute />}>
                    <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                </Route>

                {/* ── Protected dashboard ── */}
                <Route element={<ProtectedRoute allowedRoles={[USER_ROLE.USER, USER_ROLE.ADMIN]} />}>
                    <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
                        {navConfig.map((item) => {
                            const Component = item.component;
                            const relativePath = item.path.replace("/dashboard/", "").replace("/dashboard", "");
                            return (
                                <Route
                                    key={item.key}
                                    path={relativePath || undefined}
                                    index={!relativePath}
                                    element={<Component />}
                                />
                            );
                        })}
                    </Route>
                </Route>

                {/* ── 404 ── */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;

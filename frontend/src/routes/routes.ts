/**
 * ROUTES — single source of truth for all route paths.
 * Import this wherever you need to navigate or guard.
 */
export const ROUTES = {
    // Public
    HOME:         "/",
    UNAUTHORIZED: "/unauthorized",
    SERVER_ERROR: "/server-error",

    // Auth (guest only)
    LOGIN:    "/login",
    REGISTER: "/register",

    // Protected
    DASHBOARD:   "/dashboard",
    FUNDAMENTAL: "/dashboard/fundamental",
    ANALYTICS:   "/dashboard/analytics",
    PREDICTIONS: "/dashboard/predictions",
    PROFILE:     "/dashboard/profile",
    SETTINGS:    "/dashboard/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

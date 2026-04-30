import React,{ lazy } from 'react';

 const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
 const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'));

const routes =[
    {
        name: "Dashboard",
        key: "dashboard",
        route: "/dashboard",
        icon: React.createElement("i", { className: "fas fa-tachometer-alt" }),
        buttonLabel: "Dashboard",
    },
    {
        name: "Profile",
        key: "profile",
        route: "/profile",
        icon: React.createElement("i", { className: "fas fa-user" }),
        buttonLabel: "Profile",
    },
    {
        name: "Predictions",
        key: "predictions",
        route: "/predictions",
        icon: React.createElement("i", { className: "fas fa-chart-line" }),
        buttonLabel: "Predictions",
    },
    {
        name: "Settings",
        key: "settings",
        route: "/settings",
        icon: React.createElement("i", { className: "fas fa-cog" }),
        buttonLabel: "Settings",
    },

    //Auth fallback routes
    {type: "route", key: "login", route: "/login" ,component : LoginPage},
    {type: "auth", key: "register", route: "/register",component: RegisterPage},
]
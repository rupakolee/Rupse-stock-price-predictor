import { LayoutDashboard, TrendingUp, BarChart2, BookOpen, Newspaper, MessageSquareText } from "lucide-react";
import { lazy } from "react";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

const DashboardHome   = lazy(() => import("../pages/DashboardHome"));
const FundamentalPage = lazy(() => import("../pages/FundamentalPage"));
const AnalyticsPage   = lazy(() => import("../pages/AnalyticsPage"));
const PredictionsPage = lazy(() => import("../pages/PredictionsPage"));
const SentimentPage   = lazy(() => import("../pages/SentimentPage"));
const NewsPage        = lazy(() => import("../pages/NewsPage"));

export interface NavItem {
    name:       string
    key:        string
    path:       string
    icon:       LucideIcon
    component:  ComponentType
}

export const navConfig: NavItem[] = [
    { name: "Dashboard",   key: "dashboard",   path: "/dashboard",             icon: LayoutDashboard,  component: DashboardHome   },
    { name: "Fundamental", key: "fundamental", path: "/dashboard/fundamental", icon: BookOpen,         component: FundamentalPage },
    { name: "Analytics",   key: "analytics",   path: "/dashboard/analytics",   icon: BarChart2,        component: AnalyticsPage   },
    { name: "Predictions", key: "predictions", path: "/dashboard/predictions", icon: TrendingUp,       component: PredictionsPage },
    { name: "Sentiment",   key: "sentiment",   path: "/dashboard/sentiment",   icon: MessageSquareText, component: SentimentPage  },
    { name: "News",        key: "news",        path: "/dashboard/news",        icon: Newspaper,        component: NewsPage        },
]

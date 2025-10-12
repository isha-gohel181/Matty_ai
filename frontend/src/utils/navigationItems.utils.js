import { Activity, BarChart2, Database, FileUp, Home, Settings, Shield, User, LayoutTemplate, } from "lucide-react";

export const navigationItems = [
    {
        name: "Dashboard",
        icon: Home,
        badge: null,
        path: "/dashboard/editor",
    },
    {
        name: "Files",
        icon: FileUp,

        badge: "12",
        path: "/dashboard/files",
    },
    {
        name: "Templates", // Add this new item
        icon: LayoutTemplate,
        badge: null,
        path: "/dashboard/templates",
    },
    {
        name: "Analytics",
        icon: BarChart2,
        badge: null,
        path: "/dashboard/analytics",
    },
    {
        name: "Activity",
        icon: Activity,
        badge: "3",
        path: "/dashboard/activity",
    },
];
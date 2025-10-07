import { Activity, BarChart2, Database, FileUp, Home, Settings, Shield, User } from "lucide-react";

export const navigationItems = [
    {
        name: "Dashboard",
        icon: Home,
        badge: null,
        path: "/dashboard",
    },
    {
        name: "Files",
        icon: FileUp,

        badge: "12",
        path: "/dashboard/files",
    },
    {
        name: "Activity",
        icon: Activity,
        badge: "3",
        path: "/dashboard/activity",
    },
    {
        name: "Database",
        icon: Database,
        badge: null,
        path: "/dashboard/database",
    },
    {
        name: "Security",
        icon: Shield,
        badge: null,
        path: "/dashboard/security",
    },
    {
        name: "Profile",
        icon: User,
        badge: null,
        path: "/dashboard/profile",
    },

];
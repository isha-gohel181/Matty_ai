import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { navigationItems } from "@/utils/navigationItems.utils.js";
import { selectUser } from "@/redux/slice/user/user.slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const user = useSelector(selectUser);

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col">
      <div className="h-16 p-4 border-b flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-foreground tracking-wide"
        >
          Matty
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.name}
            asChild
            variant={location.pathname.startsWith(item.path) ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link to={item.path}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar?.secure_url} alt={user?.fullName} />
            <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
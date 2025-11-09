import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { navigationItems } from "@/utils/navigationItems.utils.js";
import { selectUser, logoutUser } from "@/redux/slice/user/user.slice";
import { useTheme } from "@/context/ThemeContext.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Sun, Moon, X } from "lucide-react";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col h-full">
      <div className="h-16 p-4 border-b flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-foreground tracking-wide"
        >
          Matty
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
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
      <div className="p-4">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="w-full justify-start"
        >
          {theme === "light" ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>
      <div className="p-4 border-t mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center gap-3 text-left p-2 rounded-md hover:bg-accent transition-colors">
              <Avatar>
                <AvatarImage src={user?.avatar?.secure_url} alt={user?.fullName} />
                <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" side="top">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link to="/dashboard/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
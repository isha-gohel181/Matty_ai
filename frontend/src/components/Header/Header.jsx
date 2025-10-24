import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext.jsx";
import { selectIsAuthenticated, logoutUser } from "@/redux/slice/user/user.slice.js";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/');
    });
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Templates", href: "#" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-3">
        <div className="flex items-center justify-between rounded-full bg-card/80 backdrop-blur-xl border border-border p-3 px-6 shadow-lg">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-foreground tracking-wide">
            Matty
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate('/dashboard/editor')}
                  variant="ghost"
                  className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition"
                >
                  Log In
                </Button>

                <Button
                  onClick={() => navigate('/signup')}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-teal-500 text-white px-5 hover:opacity-90 transition"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Menu
              className="text-foreground w-6 h-6 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 bg-card/80 backdrop-blur-xl border border-border rounded-xl p-4 flex flex-col gap-4 shadow-lg">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => {
                    navigate('/dashboard');
                    setOpen(false);
                  }}
                  variant="ghost"
                  className="text-foreground/80 hover:text-foreground transition font-medium justify-start"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  variant="ghost"
                  className="text-foreground/80 hover:text-foreground transition font-medium justify-start"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-foreground/80 hover:text-foreground transition font-medium"
                  onClick={() => setOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-500 to-teal-500 text-white text-center rounded-full py-2 font-medium hover:opacity-90 transition"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Header;
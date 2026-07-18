import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext.jsx";
import { selectIsAuthenticated, logoutUser } from "@/redux/slice/user/user.slice.js";

import logo from "@/assets/Mattty_ai_logo.png";

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
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-screen-xl px-4 py-3">
        <div className="flex items-center justify-between rounded-full bg-background/30 backdrop-blur-md border border-white/10 p-3 px-6 shadow-lg">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Matty AI Logo" className="h-11 w-auto object-contain" />
            <span className="text-2xl font-bold font-display uppercase tracking-wider text-foreground">Matty AI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="relative overflow-hidden text-foreground/80 hover:text-foreground transition-colors font-medium after:absolute after:-bottom-px after:left-0 after:w-full after:h-0.5 after:bg-current after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 font-utility uppercase tracking-widest text-xs"
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
              className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition font-utility uppercase tracking-widest text-xs"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate('/dashboard/editor')}
                  variant="ghost"
                  className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition font-utility uppercase tracking-widest text-xs px-5"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition font-utility uppercase tracking-widest text-xs px-5"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="rounded-full text-foreground/80 hover:text-foreground hover:bg-accent transition font-utility uppercase tracking-widest text-xs px-5"
                >
                  Log In
                </Button>

                <Button
                  onClick={() => navigate('/signup')}
                  className="rounded-full px-5 font-utility uppercase tracking-widest text-xs"
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
          <div className="md:hidden mt-2 bg-background/30 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col gap-4 shadow-lg">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="relative overflow-hidden text-foreground/80 hover:text-foreground transition-colors font-medium after:absolute after:-bottom-px after:left-0 after:w-full after:h-0.5 after:bg-current after:transform after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 font-utility uppercase tracking-widest text-xs"
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
                  className="text-foreground/80 hover:text-foreground transition font-medium justify-start font-utility uppercase tracking-widest text-xs"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  variant="ghost"
                  className="text-foreground/80 hover:text-foreground transition font-medium justify-start font-utility uppercase tracking-widest text-xs"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-foreground/80 hover:text-foreground transition font-medium font-utility uppercase tracking-widest text-xs pl-4"
                  onClick={() => setOpen(false)}
                >
                  Log In
                </Link>
                <Button
                  onClick={() => {
                    navigate('/signup');
                    setOpen(false);
                  }}
                  className="rounded-full w-full font-utility uppercase tracking-widest text-xs"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Header;
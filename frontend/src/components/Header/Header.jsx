import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
        <div className="flex items-center justify-between rounded-full bg-white/5 backdrop-blur-xl border border-white/10 p-3 px-6 shadow-lg">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            Matty
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              Log In
            </Button>

            <Button
              onClick={() => navigate('/signup')}
              className="rounded-full bg-gradient-to-r from-purple-500 to-teal-500 text-white px-5 hover:opacity-90 transition"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Menu
              className="text-white w-6 h-6 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-4 shadow-lg">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors font-medium"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/login"
              className="text-white/80 hover:text-white transition font-medium"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-500 to-teal-500 text-white text-center rounded-full py-2 font-medium hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Header;
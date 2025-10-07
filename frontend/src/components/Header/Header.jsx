// src/components/layout/Header.jsx
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import ThemeToogleButton from "../Buttons/ThemeToogleButton";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`relative backdrop-blur-sm border-b transition-all duration-300 ${
        theme === "light"
          ? "bg-white/95 text-gray-800 border-gray-200 shadow-lg shadow-green-100/50"
          : "bg-gray-900/95 text-white border-gray-700 shadow-lg shadow-green-500/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo / Title */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <div
                onClick={() => navigate("/")}
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-all duration-300 group-hover:scale-105 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Matty
                <span className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
            </div>
            <div
              className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                theme === "light"
                  ? "bg-green-100 text-green-700"
                  : "bg-green-900/50 text-green-300"
              }`}
            >
              Platform
            </div>
          </div>
          <ThemeToogleButton theme={theme} setTheme={setTheme} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`${item.toLowerCase()}`}
                className={`relative text-base font-semibold transition-all duration-300 group ${
                  theme === "light"
                    ? "text-gray-700 hover:text-green-600"
                    : "text-gray-300 hover:text-green-400"
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                theme === "light"
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 w-6 transition-all duration-300 ${
                    theme === "light" ? "bg-gray-800" : "bg-white"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                ></span>
                <span
                  className={`block h-0.5 w-6 transition-all duration-300 ${
                    theme === "light" ? "bg-gray-800" : "bg-white"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`block h-0.5 w-6 transition-all duration-300 ${
                    theme === "light" ? "bg-gray-800" : "bg-white"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-4 py-6 space-y-4 border-t ${
            theme === "light"
              ? "bg-white border-gray-200 shadow-lg"
              : "bg-gray-900 border-gray-700 shadow-lg"
          }`}
        >
          {["About", "Contact"].map((item, index) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-lg font-semibold transition-all duration-300 transform hover:translate-x-2 ${
                theme === "light"
                  ? "text-gray-700 hover:text-green-600"
                  : "text-gray-300 hover:text-green-400"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    theme === "light" ? "bg-green-500" : "bg-green-400"
                  }`}
                ></span>
                <span>{item}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;

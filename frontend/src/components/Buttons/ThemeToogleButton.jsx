import React from "react";

const ThemeToogleButton = ({ theme, setTheme }) => {
  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`relative -right-180 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 ease-in-out 
    ${
      theme === "light"
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:ring-4 hover:ring-green-400/30"
        : "bg-gradient-to-r from-gray-700 to-gray-900 text-yellow-300 shadow-lg shadow-gray-900/50 hover:shadow-gray-700/70 hover:ring-4 hover:ring-gray-600/40"
    }`}
      >
        <span
          className={`transition-transform duration-500 text-2xl ${
            theme === "light" ? "rotate-0" : "rotate-180"
          }`}
        >
          {theme === "light" ? "🌞" : "🌙"}
        </span>
      </button>
    </div>
  );
};

export default ThemeToogleButton;

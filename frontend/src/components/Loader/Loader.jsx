// Loader.jsx
import React from "react";

const Loader = ({ size = 48, text = "Uploading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Spinner */}
      <div
        className="animate-spin rounded-full border-4 border-green-500 border-t-transparent"
        style={{ width: size, height: size }}
      ></div>

      {/* Text */}
      <p className="text-green-600 font-semibold text-sm">{text}</p>
    </div>
  );
};

export default Loader;

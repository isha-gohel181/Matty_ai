import { AlertCircle, CheckCircle, X } from 'lucide-react';
import React from 'react'

const CustomAlert = ({ type, message, onClose }) => {
  const isError = type === "error";
  const isSuccess = type === "success";
  
  return (
    <div className={`fixed top-4 right-4 max-w-md p-4 rounded-xl shadow-lg z-50 animate-slide-in ${
      isError ? "bg-red-500 text-white" : 
      isSuccess ? "bg-green-500 text-white" : 
      "bg-blue-500 text-white"
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isError && <AlertCircle size={20} />}
          {isSuccess && <CheckCircle size={20} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 hover:bg-black/10 rounded-full p-1 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CustomAlert
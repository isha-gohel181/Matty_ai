// src/components/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // or your auth context

const ProtectedRoute = ({ children, isAuthenticated}) => {
  const dispatch = useDispatch();




  // if (loading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <p className="text-lg font-semibold animate-pulse">
  //         Checking session...
  //       </p>
  //     </div>
  //   );
  // }
  // 👆 assuming your redux slice stores `user` after login
  // If you use Context API, replace this with useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

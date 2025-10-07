import React from "react";
import { Outlet } from "react-router-dom";

const AuthPageLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-0 py-0">
        <Outlet />
      </main>

      {/* Footer */}
    </div>
  );
};

export default AuthPageLayout;

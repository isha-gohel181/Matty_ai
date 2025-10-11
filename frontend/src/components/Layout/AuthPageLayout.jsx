import React from "react";
import { Outlet } from "react-router-dom";

const AuthPageLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border shadow-2xl md:grid-cols-2">
        {/* Left Panel: Branding */}
        <div className="hidden flex-col justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-white md:flex">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
            Join Matty Today
          </h1>
          <p className="text-lg text-blue-100">
            Start creating stunning content with the help of AI in seconds.
          </p>
        </div>

        {/* Right Panel: Form Content */}
        <div className="bg-card text-card-foreground flex items-center justify-center p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;
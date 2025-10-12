import React, { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import {
  selectIsAuthenticated,
  getLoggedInUserInfo,
} from "./redux/slice/user/user.slice.js";

// Lazy loaded imports
const Home = lazy(() => import("./pages/PublicPages/Home"));
const Layout = lazy(() => import("./components/Layout/Layout"));
const Register = lazy(() => import("./pages/AuthPages/Register"));
const Login = lazy(() => import("./pages/AuthPages/Login"));
const ForgotPassword = lazy(() => import("./pages/AuthPages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/AuthPages/ResetPassword")); // Import ResetPassword
const AuthPageLayout = lazy(() => import("./components/Layout/AuthPageLayout"));

// Import the new DashboardLayout
const DashboardLayout = lazy(() => import("./components/Layout/DashboardLayout"));

const DashboardProfile = lazy(() =>
  import("./pages/DashboardPages/DashboardProfile")
);
const TemplatesPage = lazy(() =>
  import("./pages/DashboardPages/TemplatesPage")
);
const DashboardActivity = lazy(() =>
  import("./pages/DashboardPages/DashboardActivity")
);
const DashboardFiles = lazy(() => import("./pages/DashboardPages/DashboardFile"));
const EditorPage = lazy(() => import("./pages/DashboardPages/EditorPage"));
const AnalyticsPage = lazy(() => import("./pages/DashboardPages/AnalyticsPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/DashboardPages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/DashboardPages/AdminUsers"));
const AdminModeration = lazy(() => import("./pages/DashboardPages/AdminModeration"));

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // On refresh, do not check authentication, redirect to home
    setIsAppLoading(false);
  }, []);

  const FullPageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  if (isAppLoading) {
    return <FullPageLoader />;
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<Home />}
          />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthPageLayout />}>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Register />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Add this route */}
        </Route>

        {/* Protected Dashboard Routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="files" element={<DashboardFiles />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="activity" element={<DashboardActivity />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/moderation" element={<AdminModeration />} />
          {/* Add other dashboard routes here */}
        </Route>

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard/files" : "/"} />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
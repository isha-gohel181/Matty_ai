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
const AuthPageLayout = lazy(() => import("./components/Layout/AuthPageLayout"));

// Import the new DashboardLayout
const DashboardLayout = lazy(() => import("./components/Layout/DashboardLayout"));

const DashboardProfile = lazy(() =>
  import("./pages/DashboardPages/DashboardProfile")
);
const DashboardActivity = lazy(() =>
  import("./pages/DashboardPages/DashboardActivity")
);
const DashboardFiles = lazy(() => import("./pages/DashboardPages/DashboardFile"));
const EditorPage = lazy(() => import("./pages/DashboardPages/EditorPage"));

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    dispatch(getLoggedInUserInfo()).finally(() => {
      setIsAppLoading(false);
    });
  }, [dispatch]);

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
            element={
              isAuthenticated ? <Navigate to="/dashboard/files" /> : <Home />
            }
          />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthPageLayout />}>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard/files" /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard/files" /> : <Register />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
import React from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean; // New prop to specify if route is admin-only
  userOnly?: boolean;  // New prop to specify if route is user-only
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  adminOnly = false,
  userOnly = false
}) => {
  const token = localStorage.getItem("accessToken");

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Get user data to check admin status
  let user;
  try {
    const userData = localStorage.getItem("user");
    user = userData ? JSON.parse(userData) : {};
  } catch (error) {
    console.error("Error parsing user data:", error);
    user = {};
  }

  const isAdmin = user?.isAdmin || false;

  // If route is admin-only but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If route is user-only but user is admin
  if (userOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
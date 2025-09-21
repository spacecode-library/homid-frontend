import React from "react";
import { Navigate } from "react-router-dom";

type PublicUserRouteProps = {
  children: React.ReactNode;
};

const PublicUserRoute: React.FC<PublicUserRouteProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  // If no token, allow access (public route)
  if (!token) {
    return <>{children}</>;
  }

  // If logged in, check if user is admin
  let user;
  try {
    const userData = localStorage.getItem("user");
    user = userData ? JSON.parse(userData) : {};
  } catch (error) {
    console.error("Error parsing user data:", error);
    user = {};
  }

  const isAdmin = user?.isAdmin || false;

  // If user is admin, redirect to admin page
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // If regular user (logged in but not admin), allow access
  return <>{children}</>;
};

export default PublicUserRoute;
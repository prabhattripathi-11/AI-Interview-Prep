import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'user'; // default to user if missing

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Role not authorized, redirect to dashboard (or appropriate page)
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;

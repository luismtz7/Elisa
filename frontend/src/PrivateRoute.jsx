// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('access_token'); // Verifica si hay un token de acceso

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export { PrivateRoute };
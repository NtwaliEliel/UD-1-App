// filepath: client/src/components/ProtectedRoute.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path?: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
    />
  );
};

export default ProtectedRoute;
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProctorRouteProps {
  children: ReactNode;
}

const ProctorRoute: React.FC<ProctorRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? (
    // Render children if the user is authenticated
    <>{children}</>
  ) : (
    // Navigate to a login page if the user is not authenticated
    <Navigate to="/login" replace />
  );
};

export default ProctorRoute;

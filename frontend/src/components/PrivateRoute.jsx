import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utilities/AuthProvider'

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Signed in as: ', user);

  return children;
}

export default PrivateRoute
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="flex justify-center items-center h-screen">لوڈ ہو رہا ہے...</div>;
  
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

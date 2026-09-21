import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [claimLoading, setClaimLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAdminClaim = async () => {
      if (!user) {
        if (active) {
          setIsAdmin(false);
          setClaimLoading(false);
        }
        return;
      }

      setClaimLoading(true);

      try {
        const tokenResult = await user.getIdTokenResult();
        const adminClaim = tokenResult?.claims?.admin === true;

        if (active) {
          setIsAdmin(adminClaim);
        }
      } catch (error) {
        console.error('Admin claim verification error:', error);

        if (active) {
          setIsAdmin(false);
        }
      } finally {
        if (active) {
          setClaimLoading(false);
        }
      }
    };

    checkAdminClaim();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading || claimLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9] px-4">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#4A0E0E]/20 border-t-[#D4AF37]" />
          <p className="text-sm font-semibold text-[#4A0E0E]">
            اجازت کی تصدیق ہو رہی ہے...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

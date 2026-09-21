import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const ALLOWED_ADMIN_EMAIL = 'azwajmarriage@gmail.com';

const AdminLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });

      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;

      if (
        (user.email || '').toLowerCase() !==
        ALLOWED_ADMIN_EMAIL.toLowerCase()
      ) {
        await signOut(auth);
        setError('صرف مجاز Azwaj Google account سے لاگ ان کیا جا سکتا ہے۔');
        return;
      }

      // Custom claims may have changed since the previous token.
      const tokenResult = await user.getIdTokenResult(true);
      const isAdmin = tokenResult?.claims?.admin === true;

      if (!isAdmin) {
        await signOut(auth);
        setError('اس Google account کو ایڈمن رسائی حاصل نہیں ہے۔');
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Google admin login error:', err);

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google لاگ ان منسوخ کر دیا گیا۔');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Browser نے Google login window روک دی۔ دوبارہ کوشش کریں۔');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Google login پہلے ہی جاری ہے۔');
      } else {
        setError('Google لاگ ان کے دوران مسئلہ پیش آیا۔ دوبارہ کوشش کریں۔');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-center py-12 px-4 font-[Noto_Sans_Urdu]">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4A0E0E] text-2xl text-[#D4AF37] shadow-sm">
            A
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[#4A0E0E]">
            ایڈمن لاگ ان
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            صرف مجاز Azwaj administrator کے لیے
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-white p-6 shadow-sm sm:p-8">
          {error && (
            <div
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
              <p className="text-xs text-gray-500">
                مجاز Google account
              </p>
              <p className="mt-1 text-sm font-semibold text-[#4A0E0E]" dir="ltr">
                {ALLOWED_ADMIN_EMAIL}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                loading ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              <span className="text-lg">G</span>
              {loading
                ? 'Google account کی تصدیق ہو رہی ہے...'
                : 'Google سے لاگ ان کریں'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

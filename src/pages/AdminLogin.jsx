import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Custom claims may have changed since the previous token.
      const tokenResult = await credential.user.getIdTokenResult(true);
      const isAdmin = tokenResult?.claims?.admin === true;

      if (!isAdmin) {
        await signOut(auth);
        setError('اس اکاؤنٹ کو ایڈمن رسائی حاصل نہیں ہے۔');
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);

      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('ای میل یا پاس ورڈ غلط ہے۔');
      } else if (err.code === 'auth/too-many-requests') {
        setError(
          'بہت زیادہ کوششیں کی گئیں۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔'
        );
      } else {
        setError('لاگ ان کے دوران کوئی مسئلہ پیش آیا۔ دوبارہ کوشش کریں۔');
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
            صرف مجاز Azwaj administrators کے لیے
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

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-right text-sm font-medium text-gray-700">
                ای میل ایڈریس
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                dir="ltr"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-left shadow-sm outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-right text-sm font-medium text-gray-700">
                پاس ورڈ
              </label>

              <input
                type="password"
                required
                autoComplete="current-password"
                dir="ltr"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-left shadow-sm outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center rounded-xl bg-[#4A0E0E] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#5C1515] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                loading ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              {loading ? 'اجازت کی تصدیق ہو رہی ہے...' : 'لاگ ان کریں'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

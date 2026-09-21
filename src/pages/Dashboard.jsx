import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getCountFromServer,
  query,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../utils/firebase';

const StatCard = ({ title, value, icon, loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-2xl border border-[#4A0E0E]/10 bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
  >
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-[#4A0E0E] sm:text-3xl">
          {loading ? '—' : value}
        </p>
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4A0E0E]/5 text-xl text-[#4A0E0E]">
        {icon}
      </div>
    </div>
  </button>
);

const QuickAction = ({ title, description, path, icon, onClick }) => (
  <button
    type="button"
    onClick={() => {
      if (onClick) {
        onClick();
        return;
      }
      window.location.href = path;
    }}
    className="flex w-full items-center gap-3 rounded-xl border border-[#4A0E0E]/10 bg-white p-4 text-right transition hover:border-[#D4AF37]/60 hover:shadow-sm"
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4A0E0E] text-[#D4AF37]">
      {icon}
    </span>

    <span className="min-w-0">
      <span className="block truncate text-sm font-semibold text-gray-800">
        {title}
      </span>
      <span className="mt-0.5 block truncate text-xs text-gray-500">
        {description}
      </span>
    </span>
  </button>
);

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [stats, setStats] = React.useState({
    profiles: 0,
    publicProfiles: 0,
    pendingVerification: 0,
  });

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;

    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const [
          profilesSnapshot,
          publicProfilesSnapshot,
          pendingVerificationSnapshot,
        ] = await Promise.all([
          getCountFromServer(collection(db, 'profiles')),

          getCountFromServer(
            query(
              collection(db, 'profiles'),
              where('profileVisibility', '==', 'public')
            )
          ),

          getCountFromServer(
            query(
              collection(db, 'verifications'),
              where('status', '==', 'submitted')
            )
          ),
        ]);

        if (!active) return;

        setStats({
          profiles: profilesSnapshot.data().count,
          publicProfiles: publicProfilesSnapshot.data().count,
          pendingVerification:
            pendingVerificationSnapshot.data().count,
        });
      } catch (err) {
        console.error('Admin dashboard stats error:', err);

        if (!active) return;

        setError(
          'Dashboard statistics لوڈ نہیں ہو سکیں۔ Firebase permissions یا data structure چیک کریں۔'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#D4AF37]">
            خوش آمدید
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#4A0E0E] sm:text-3xl">
            Azwaj Admin Dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Azwaj platform کی مرکزی انتظامی نگرانی
          </p>
        </div>

        <div className="truncate rounded-xl border border-[#4A0E0E]/10 bg-white px-4 py-2 text-xs text-gray-500 shadow-sm">
          {user?.email || 'Admin'}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="کل پروفائلز"
          value={stats.profiles}
          icon="♙"
          loading={loading}
          onClick={() => navigate('/users')}
        />

        <StatCard
          title="Public پروفائلز"
          value={stats.publicProfiles}
          icon="◎"
          loading={loading}
          onClick={() => navigate('/users')}
        />

        <StatCard
          title="زیرِ التوا تصدیق"
          value={stats.pendingVerification}
          icon="✓"
          loading={loading}
          onClick={() => navigate('/verification')}
        />
      </div>

      {/* Main sections */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#4A0E0E]">
                فوری انتظامی کارروائیاں
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                اہم Admin modules تک فوری رسائی
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <QuickAction
                title="صارفین اور پروفائلز"
                description="Users اور profiles دیکھیں"
                path="/users"
                icon="♙"
                onClick={() => navigate('/users')}
              />

              <QuickAction
                title="پروفائل تصدیق"
                description="Pending verification دیکھیں"
                path="/verification"
                icon="✓"
                onClick={() => navigate('/verification')}
              />

              <QuickAction
                title="رپورٹس اور سیفٹی"
                description="Reports اور moderation"
                path="/reports"
                icon="⚠"
                onClick={() => navigate('/reports')}
              />

              <QuickAction
                title="قیمتوں کا کنٹرول"
                description="Azwaj pricing policies"
                path="/pricing"
                icon="₿"
                onClick={() => navigate('/pricing')}
              />
            </div>
          </div>
        </div>

        {/* System status */}
        <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-[#4A0E0E]">
            System Status
          </h3>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">
                Admin Authentication
              </span>
              <span className="text-xs font-semibold text-green-600">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">
                Firestore
              </span>
              <span
                className={`text-xs font-semibold ${
                  error ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {error ? 'Check' : loading ? 'Checking' : 'Connected'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">
                Admin UI
              </span>
              <span className="text-xs font-semibold text-green-600">
                Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture notice */}
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 sm:p-5">
        <p className="text-sm font-semibold text-[#4A0E0E]">
          Azwaj Administration
        </p>
        <p className="mt-1 text-xs leading-6 text-gray-600">
          Dashboard صرف ضروری aggregate counts استعمال کرتا ہے تاکہ
          غیر ضروری طور پر پورے profiles collection کو download نہ کرنا پڑے۔
        </p>
      </div>
    </section>
  );
};

export default Dashboard;

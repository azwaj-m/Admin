import React from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 50;

const Users = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [search, setSearch] = React.useState('');

  const loadProfiles = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const snapshot = await getDocs(
        query(collection(db, 'profiles'), limit(PAGE_SIZE))
      );

      setProfiles(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error('Admin users error:', err);
      setError('صارفین کا ڈیٹا لوڈ نہیں ہو سکا۔');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const filteredProfiles = React.useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return profiles;

    return profiles.filter((profile) => {
      const text = [
        profile.name,
        profile.fullName,
        profile.displayName,
        profile.email,
        profile.city,
        profile.country,
        profile.gender,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return text.includes(value);
    });
  }, [profiles, search]);

  const getName = (profile) =>
    profile.name ||
    profile.fullName ||
    profile.displayName ||
    'نام دستیاب نہیں';

  const getVisibility = (profile) =>
    profile.profileVisibility === 'public'
      ? 'Public'
      : 'Private';

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#4A0E0E]">
            صارفین اور پروفائلز
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Azwaj profiles کا انتظام اور جائزہ
          </p>
        </div>

        <button
          type="button"
          onClick={loadProfiles}
          disabled={loading}
          className="rounded-xl bg-[#4A0E0E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#641515] disabled:opacity-50"
        >
          {loading ? 'لوڈ ہو رہا ہے...' : 'دوبارہ لوڈ کریں'}
        </button>
      </div>

      <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-4 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="نام، ای میل، شہر یا ملک تلاش کریں..."
          className="w-full rounded-xl border border-gray-200 bg-[#FFFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          dir="rtl"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {!loading && filteredProfiles.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            کوئی پروفائل نہیں ملی۔
          </div>
        )}

        {filteredProfiles.map((profile) => (
          <button
            type="button"
            key={profile.id}
            onClick={() => navigate(`/users/${profile.id}`)}
            className="w-full rounded-2xl border border-[#4A0E0E]/10 bg-white p-4 text-right shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-[#4A0E0E]">
                  {getName(profile)}
                </h3>

                <p className="mt-1 truncate text-xs text-gray-500">
                  {profile.email || 'ای میل دستیاب نہیں'}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  profile.profileVisibility === 'public'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {getVisibility(profile)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-gray-50 p-2">
                <span className="block text-gray-400">شہر</span>
                <span className="mt-1 block text-gray-700">
                  {profile.city || '—'}
                </span>
              </div>

              <div className="rounded-lg bg-gray-50 p-2">
                <span className="block text-gray-400">ملک</span>
                <span className="mt-1 block text-gray-700">
                  {profile.country || '—'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop/tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#4A0E0E]/10 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="bg-[#4A0E0E] text-white">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold">نام</th>
                <th className="px-4 py-3 text-xs font-semibold">ای میل</th>
                <th className="px-4 py-3 text-xs font-semibold">شہر</th>
                <th className="px-4 py-3 text-xs font-semibold">ملک</th>
                <th className="px-4 py-3 text-xs font-semibold">Visibility</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {!loading && filteredProfiles.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    کوئی پروفائل نہیں ملی۔
                  </td>
                </tr>
              )}

              {filteredProfiles.map((profile) => (
                <tr
                  key={profile.id}
                  onClick={() => navigate(`/users/${profile.id}`)}
                  className="cursor-pointer transition hover:bg-[#FFFDF9]"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                    {getName(profile)}
                  </td>

                  <td className="max-w-[240px] truncate px-4 py-4 text-sm text-gray-500">
                    {profile.email || '—'}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {profile.city || '—'}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {profile.country || '—'}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        profile.profileVisibility === 'public'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getVisibility(profile)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        زیادہ سے زیادہ پہلے {PAGE_SIZE} profiles لوڈ کیے جاتے ہیں تاکہ Admin
        panel غیرضروری data download نہ کرے۔
      </p>
    </section>
  );
};

export default Users;

import React from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';

const Verification = () => {
  const navigate = useNavigate();

  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const loadVerifications = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const verificationQuery = query(
        collection(db, 'verifications'),
        orderBy('submittedAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(verificationQuery);

      setItems(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (err) {
      console.error('Admin verification error:', err);
      setError(
        'Verification data لوڈ نہیں ہو سکا۔ Firebase permissions یا index چیک کریں۔'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  const pending = items.filter(
    (item) => item.status === 'submitted'
  );

  const approved = items.filter(
    (item) => item.status === 'approved'
  );

  const rejected = items.filter(
    (item) => item.status === 'rejected'
  );

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '—';

    return timestamp
      .toDate()
      .toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  };

  const statusLabel = (status) => {
    if (status === 'approved') return 'Approved';
    if (status === 'rejected') return 'Rejected';
    if (status === 'submitted') return 'Pending';
    return status || 'Unknown';
  };

  const statusClass = (status) => {
    if (status === 'approved') {
      return 'bg-green-50 text-green-700';
    }

    if (status === 'rejected') {
      return 'bg-red-50 text-red-700';
    }

    return 'bg-amber-50 text-amber-700';
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#4A0E0E]">
            پروفائل تصدیق
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Verification requests کا جائزہ اور management
          </p>
        </div>

        <button
          type="button"
          onClick={loadVerifications}
          disabled={loading}
          className="rounded-xl bg-[#4A0E0E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#641515] disabled:opacity-50"
        >
          {loading ? 'لوڈ ہو رہا ہے...' : 'دوبارہ لوڈ کریں'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">
            {loading ? '—' : pending.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs text-green-700">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-800">
            {loading ? '—' : approved.length}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs text-red-700">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-red-800">
            {loading ? '—' : rejected.length}
          </p>
        </div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            ابھی کوئی verification request موجود نہیں۔
          </div>
        )}

        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => navigate(`/users/${item.uid || item.id}`)}
            className="w-full rounded-2xl border border-[#4A0E0E]/10 bg-white p-4 text-right shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#4A0E0E]">
                  {item.uid || item.id}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {item.documentType || 'CNIC'}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                  item.status
                )}`}
              >
                {statusLabel(item.status)}
              </span>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Submitted: {formatDate(item.submittedAt)}
            </div>
          </button>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#4A0E0E]/10 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-right">
            <thead className="bg-[#4A0E0E] text-white">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold">
                  User ID
                </th>

                <th className="px-4 py-3 text-xs font-semibold">
                  Document
                </th>

                <th className="px-4 py-3 text-xs font-semibold">
                  Submitted
                </th>

                <th className="px-4 py-3 text-xs font-semibold">
                  Status
                </th>

                <th className="px-4 py-3 text-xs font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {!loading && items.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    ابھی کوئی verification request موجود نہیں۔
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-[#FFFDF9]"
                >
                  <td className="max-w-[220px] truncate px-4 py-4 text-sm font-medium text-gray-800">
                    {item.uid || item.id}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {item.documentType || 'CNIC'}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(item.submittedAt)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                        item.status
                      )}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/users/${item.uid || item.id}`)
                      }
                      className="rounded-lg border border-[#4A0E0E]/10 px-3 py-2 text-xs font-semibold text-[#4A0E0E] hover:bg-[#4A0E0E] hover:text-white"
                    >
                      Profile Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        زیادہ سے زیادہ 50 verification records ایک وقت میں لوڈ کیے جاتے ہیں۔
      </p>
    </section>
  );
};

export default Verification;

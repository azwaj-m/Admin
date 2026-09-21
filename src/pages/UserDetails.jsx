import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../utils/firebase';

const Field = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 p-3">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="mt-1 break-words text-sm font-medium text-gray-800">
      {value || '—'}
    </p>
  </div>
);

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!id) {
        setError('Profile ID دستیاب نہیں ہے۔');
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, 'profiles', id));

        if (!active) return;

        if (!snapshot.exists()) {
          setError('یہ پروفائل موجود نہیں ہے۔');
          return;
        }

        setProfile({
          id: snapshot.id,
          ...snapshot.data(),
        });
      } catch (err) {
        console.error('Admin profile details error:', err);

        if (active) {
          setError('پروفائل کی تفصیلات حاصل نہیں ہو سکیں۔');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-10 text-center text-sm text-gray-500">
        پروفائل لوڈ ہو رہی ہے...
      </div>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
        >
          ← واپس صارفین
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </section>
    );
  }

  const name =
    profile?.name ||
    profile?.fullName ||
    profile?.displayName ||
    'نام دستیاب نہیں';

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="mb-3 text-sm font-medium text-[#4A0E0E] hover:underline"
          >
            ← صارفین پر واپس جائیں
          </button>

          <h2 className="text-2xl font-bold text-[#4A0E0E]">
            Profile Review
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {name}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
            profile?.profileVisibility === 'public'
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {profile?.profileVisibility === 'public'
            ? 'Public Profile'
            : 'Private Profile'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#4A0E0E]/5 text-4xl text-[#4A0E0E]">
            {profile?.photoURL || profile?.img || profile?.profileImage ? (
              <img
                src={
                  profile.photoURL ||
                  profile.img ||
                  profile.profileImage
                }
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              '♙'
            )}
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold text-[#4A0E0E]">
              {name}
            </h3>

            <p className="mt-1 break-all text-xs text-gray-500">
              {profile?.email || profile?.uid || id}
            </p>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-[#4A0E0E]">
              بنیادی معلومات
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="نام" value={name} />
              <Field label="Gender" value={profile?.gender} />
              <Field label="عمر" value={profile?.age} />
              <Field label="شہر" value={profile?.city} />
              <Field label="ملک" value={profile?.country} />
              <Field label="قد" value={profile?.height} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-[#4A0E0E]">
              تعلیم اور پیشہ
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="تعلیم"
                value={
                  profile?.education ||
                  profile?.degree
                }
              />

              <Field
                label="پیشہ"
                value={
                  profile?.occupation ||
                  profile?.profession ||
                  profile?.career
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#4A0E0E]/10 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-[#4A0E0E]">
              Account / Profile Status
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Profile ID"
                value={profile?.id}
              />

              <Field
                label="Verification"
                value={profile?.verificationStatus}
              />

              <Field
                label="Visibility"
                value={profile?.profileVisibility}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDetails;

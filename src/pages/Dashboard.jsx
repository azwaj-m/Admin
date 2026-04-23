import React from 'react';
import { auth, db } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // فائرسٹور سے 'users' نامی کلیکشن کا ڈیٹا حاصل کرنا
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const [users, loading, error] = useCollectionData(q);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-[Noto_Sans_Urdu]" dir="rtl">
      {/* سائڈ بار */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 border-b border-indigo-800 pb-4">ایڈمن پینل</h2>
        <nav className="flex-grow space-y-4">
          <button className="w-full text-right py-2 px-4 rounded bg-indigo-800">ڈیش بورڈ</button>
          <button className="w-full text-right py-2 px-4 rounded hover:bg-indigo-800">صارفین</button>
        </nav>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 py-2 rounded mt-auto text-white">لاگ آؤٹ</button>
      </aside>

      {/* مین مواد */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold">صارفین کی فہرست</h1>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </header>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && <p className="p-4 text-center">ڈیٹا لوڈ ہو رہا ہے...</p>}
          {error && <p className="p-4 text-red-500">خرابی: ڈیٹا حاصل نہیں ہو سکا</p>}
          
          <table className="min-w-full divide-y divide-gray-200 text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ای میل</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((u, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.createdAt?.toDate().toLocaleDateString('ur-PK')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

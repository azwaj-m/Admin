import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ShieldCheck, UserCheck, XCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [pending, setPending] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "profiles"), where("isApproved", "==", false));
    return onSnapshot(q, (snap) => setPending(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
  }, []);

  const approve = async (id) => await updateDoc(doc(db, "profiles", id), { isApproved: true, isPremium: true, verifiedAt: new Date() });
  const reject = async (id) => window.confirm("حذف کریں؟") && await deleteDoc(doc(db, "profiles", id));

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <header className="bg-[#4A0E0E] p-6 rounded-3xl shadow-lg flex justify-between items-center mb-10">
        <h1 className="text-xl font-black text-[#D4AF37] flex items-center gap-2"><ShieldCheck /> AZWAJ ADMIN</h1>
      </header>
      <div className="max-w-4xl mx-auto space-y-4">
        {pending.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[35px] border-2 border-gray-100 flex justify-between items-center">
            <div><p className="font-black text-[#4A0E0E]">{p.fn || p.dn}</p><p className="text-xs text-gray-400">{p.religion} | {p.sect}</p></div>
            <div className="flex gap-2">
              <button onClick={() => approve(p.id)} className="bg-green-600 text-white p-3 rounded-2xl"><CheckCircle /></button>
              <button onClick={() => reject(p.id)} className="bg-red-50 text-red-600 p-3 rounded-2xl"><XCircle /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;

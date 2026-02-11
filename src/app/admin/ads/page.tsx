"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function AdminAds() {
  const { isAdmin } = useAuth();
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "ads"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => setAds(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => unsubscribe();
  }, [isAdmin]);

  const approve = async (id: string) => {
      try {
        await updateDoc(doc(db, "ads", id), { status: "active" });
      } catch (e) {
          console.error("Error approving ad: ", e);
      }
  };
  
  const reject = async (id: string) => {
    try {
      await updateDoc(doc(db, "ads", id), { status: "rejected" });
    } catch (e) {
        console.error("Error rejecting ad: ", e);
    }
};


  if (!isAdmin) return <div className="p-8">Access Denied. You must be an administrator to view this page.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Ad Requests</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="border-b dark:border-gray-700">
                <tr>
                    <th className="p-4">Business</th>
                    <th className="p-4">Payment ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody>
            {ads.map(ad => (
                <tr key={ad.id} className="border-b dark:border-gray-700">
                    <td className="p-4">{ad.businessName}</td>
                    <td className="p-4 font-mono bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-md text-xs inline-block">{ad.paymentId}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${ad.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : ad.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {ad.status}
                        </span>
                    </td>
                    <td className="p-4">
                        {ad.status === 'pending' && (
                        <div className="flex gap-2">
                            <button onClick={() => approve(ad.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Approve</button>
                            <button onClick={() => reject(ad.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Reject</button>
                        </div>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

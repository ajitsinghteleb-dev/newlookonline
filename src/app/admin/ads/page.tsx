
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import type { Ad } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, X, ShieldAlert } from 'lucide-react';

export default function AdminAdManager() {
  const { isAdmin } = useAuth();
  const [pendingAds, setPendingAds] = useState<Ad[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "ads"), where("status", "==", "pending"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => setPendingAds(snap.docs.map(d => ({id: d.id, ...d.data()}) as Ad)));
    return () => unsubscribe();
  }, [isAdmin]);

  const setStatus = async (id: string, newStatus: "active" | "rejected") => {
    try {
      await updateDoc(doc(db, "ads", id), { status: newStatus });
    } catch (e) {
        console.error(`Error updating ad status: `, e);
    }
  };

  if (!isAdmin) return <div className="p-8">Access Denied. You must be an administrator to view this page.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-red-600" />
        <h1 className="text-2xl font-black uppercase">Pending Ad <span className="text-gray-400">Verifications</span></h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingAds.map(ad => (
          <div key={ad.id} className="bg-card rounded-2xl border p-6 flex items-center gap-6 shadow-sm">
            {ad.bannerUrl && (
              <Image 
                src={ad.bannerUrl} 
                alt={`${ad.businessName} banner`} 
                width={128} 
                height={128} 
                className="w-32 h-32 rounded-xl object-cover border"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{ad.businessName}</h3>
              <div className="mt-3 inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg font-mono text-sm font-bold">
                UTR: {ad.paymentUTR}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStatus(ad.id, "active")} size="icon" className="p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 h-14 w-14"><Check /></Button>
              <Button onClick={() => setStatus(ad.id, "rejected")} size="icon" variant="outline" className="p-4 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 h-14 w-14"><X /></Button>
            </div>
          </div>
        ))}
        {pendingAds.length === 0 && <p className="text-center py-20 text-gray-400 font-medium">No pending ads to verify.</p>}
      </div>
    </div>
  );
}

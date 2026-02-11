"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import type { Ad } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function AdminAds() {
  const { isAdmin } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    // Query for only pending ads, ordered by submission time.
    const q = query(collection(db, "ads"), where("status", "==", "pending"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => setAds(snap.docs.map(d => ({id: d.id, ...d.data()}) as Ad)));
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
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Pending Ad Requests</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-card rounded-lg shadow-md border">
            <thead className="border-b">
                <tr>
                    <th className="p-4">Business</th>
                    <th className="p-4">Banner Preview</th>
                    <th className="p-4">Payment UTR</th>
                    <th className="p-4">Actions</th>
                </tr>
            </thead>
            <tbody>
            {ads.map(ad => (
                <tr key={ad.id} className="border-b">
                    <td className="p-4 align-top">{ad.businessName}</td>
                    <td className="p-4">
                      {ad.bannerUrl && (
                        <Image 
                          src={ad.bannerUrl} 
                          alt={`${ad.businessName} banner`} 
                          width={200} 
                          height={100} 
                          className="rounded-md object-cover"
                        />
                      )}
                    </td>
                    <td className="p-4 align-top font-mono bg-background/50 text-foreground/80 rounded-md text-xs inline-block">{ad.paymentUTR}</td>
                    <td className="p-4 align-top">
                        <div className="flex gap-2">
                            <Button onClick={() => approve(ad.id)} size="sm" variant="outline" className="bg-green-600 border-green-600 text-white hover:bg-green-700 hover:text-white">Approve</Button>
                            <Button onClick={() => reject(ad.id)} size="sm" variant="destructive">Reject</Button>
                        </div>
                    </td>
                </tr>
            ))}
            {ads.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center p-8 text-muted-foreground">No pending ads to review.</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

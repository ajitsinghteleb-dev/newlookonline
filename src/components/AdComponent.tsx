'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Ad } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

export default function AdComponent() {
  const firestore = useFirestore();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAd = async () => {
      if (!firestore) {
        setLoading(false);
        return;
      };
      try {
        const adsRef = collection(firestore, 'ads');
        const q = query(adsRef, where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const adsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
          // Select a random ad to display, only runs on client so Math.random is safe
          const randomAd = adsData[Math.floor(Math.random() * adsData.length)];
          setAd(randomAd);
        }
      } catch (error) {
        console.error("Failed to fetch ad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAd();
  }, [firestore]);

  if (loading) {
    return <Skeleton className="h-32 w-full rounded-xl my-6" />;
  }

  if (ad) {
    return (
      <Link href="/advertise" className="block relative h-32 my-6 rounded-xl overflow-hidden border group" target="_blank" rel="noopener noreferrer">
          <Image
            src={ad.bannerUrl}
            alt={`Advertisement for ${ad.businessName}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
           <div className="absolute bottom-1 right-2 text-white bg-black/50 px-2 py-0.5 rounded text-[10px] font-bold z-10">
            Ad
          </div>
      </Link>
    );
  }

  return (
    <Link href="/advertise" className="h-32 bg-muted/50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center my-6 hover:border-primary/50 hover:text-primary transition-colors group">
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest group-hover:text-primary">
            Advertise Here
        </span>
        <p className="text-sm font-medium text-foreground mt-1">Your Banner Could Be Here</p>
    </Link>
  );
}

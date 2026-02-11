"use client";
import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TendersPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const q = query(collection(db, "tenders"), orderBy("closingDate", "desc"));
        const snap = await getDocs(q);
        setTenders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Tenders</h1>
      </div>
      
      {loading && <div>Loading tenders...</div>}

      {!loading && (
        <div className="grid gap-4">
          {tenders.map(tender => (
            <div key={tender.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{tender.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{tender.organization}</p>
                 <p className="text-sm text-red-600 dark:text-red-500 mt-2">Closing: {tender.closingDate ? format(new Date(tender.closingDate.seconds * 1000), 'PPP') : 'N/A'}</p>
              </div>
              <a href={tender.url || '#'} target="_blank" rel="noopener noreferrer" className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded h-fit text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

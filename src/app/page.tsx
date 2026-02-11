"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import NewsCard from "@/components/NewsCard";
import AdComponent from "@/components/AdComponent";

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("timestamp", "desc"), limit(18)); // Fetching in multiples of 6 for ads
    const unsub = onSnapshot(q, (snap) => {
      setNews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching news:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-10 border-b dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter">Look<span className="text-red-600">Online</span></h1>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Verified AI News Portal</p>
        </div>
      </div>
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            </div>
        ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.flatMap((item, index) => {
            const items = [<NewsCard key={item.id} item={item} />];
            if ((index + 1) % 6 === 0) {
              items.push(
                <div key={`ad-${index}`} className="lg:col-span-3 md:col-span-2 col-span-1">
                  <AdComponent />
                </div>
              );
            }
            return items;
          })}
        </div>
      )}
    </div>
  );
}

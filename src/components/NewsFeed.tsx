'use client';

import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import NewsCard from '@/components/NewsCard';
import AdComponent from '@/components/AdComponent';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from '@/lib/types';

interface NewsFeedProps {
  initialNews: NewsArticle[];
}

export default function NewsFeed({ initialNews }: NewsFeedProps) {
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const firestore = useFirestore();

  // Only create a query if the server-side fetch failed
  const shouldFetchClientSide = !initialNews || initialNews.length === 0;

  const newsQuery = useMemoFirebase(() => {
    if (shouldFetchClientSide && firestore) {
      return query(collection(firestore, 'news'), orderBy('timestamp', 'desc'), limit(18));
    }
    return null;
  }, [shouldFetchClientSide, firestore]);

  const { data: fetchedNews, isLoading } = useCollection<NewsArticle>(newsQuery);

  useEffect(() => {
    // If we get data from the client-side fetch, update the state
    if (fetchedNews) {
      setNews(fetchedNews);
    }
  }, [fetchedNews]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  
  if (!isLoading && news.length === 0) {
    return <div className="text-center py-20 text-gray-400 font-medium">No news articles found.</div>;
  }

  return (
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
  );
}

import { getNews } from '@/lib/data';
import NewsFeed from '@/components/NewsFeed';
import { NewsArticle } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const news: NewsArticle[] = await getNews(18);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter">Look<span className="text-primary">Online</span></h1>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Verified AI News Portal</p>
        </div>
      </div>
      
      <NewsFeed initialNews={news} />
    </div>
  );
}

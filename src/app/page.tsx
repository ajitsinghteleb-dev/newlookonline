import { getNews } from '@/lib/data';
import NewsCard from "@/components/NewsCard";
import AdComponent from "@/components/AdComponent";
import { NewsArticle } from '@/lib/types';

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
      
      {news.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-medium">No news articles found.</div>
      ) : (
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

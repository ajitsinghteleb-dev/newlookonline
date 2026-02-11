"use client";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface NewsProps {
  item: any;
}

export default function NewsCard({ item }: NewsProps) {
  const { lang } = useLanguage();
  const isHindi = lang === "hi";

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded">
            {item.category}
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(item.timestamp?.seconds * 1000).toLocaleDateString()}
          </span>
        </div>
        
        <Link href={`/news/${item.urlSlug}`}>
          <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-red-600 transition-colors">
            {isHindi ? item.headline_hi : item.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {isHindi ? item.summary_hi : item.summary}
        </p>
      </div>
      
      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between">
          <Link href={`/news/${item.urlSlug}`} className="text-xs font-bold border-b-2 border-red-600 pb-0.5">
            {isHindi ? "और पढ़ें" : "Read More"}
          </Link>
          <div className="flex gap-1">
            {item.hashtags?.slice(0, 2).map((tag: string) => (
              <span key={tag} className="text-[10px] text-gray-400">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

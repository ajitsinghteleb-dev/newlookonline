"use client";
import { useEffect, useState } from 'react';
import ShareButtons from './ShareButtons';
import { formatDistanceToNow } from 'date-fns';

export default function NewsCard({ title, headline_hi, summary, category, link, timestamp }: any) {
  const [showHindi, setShowHindi] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowHindi(localStorage.getItem("app_lang") === "hi");
    }
  }, []);
  
  const timeAgo = timestamp ? formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true }) : 'Just now';

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="p-5 flex-grow">
        <span className="text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-wider">{category}</span>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg font-bold mt-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
            {showHindi && headline_hi ? headline_hi : title}
          </h3>
        </a>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
          {summary}
        </p>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {timeAgo}
        </span>
        <ShareButtons title={title} url={link || '#'} />
      </div>
    </div>
  );
}

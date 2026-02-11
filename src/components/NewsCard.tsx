"use client";
import { useEffect, useState } from 'react';
import ShareButtons from './ShareButtons';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';

export default function NewsCard({ title, headline_hi, summary, summary_hi, category, link, timestamp, credibilityScore }: any) {
  const [showHindi, setShowHindi] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('app_lang') || 'en';
    setLang(storedLang);
    setShowHindi(storedLang === "hi");
  }, []);
  
  const timeAgo = timestamp ? formatDistanceToNow(new Date(timestamp.seconds * 1000), { addSuffix: true }) : 'Just now';
  
  const getCredibilityColor = (score: number) => {
    if (score > 0.8) return 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    if (score > 0.6) return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    return 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  }

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-red-600 dark:text-red-500 uppercase tracking-wider">{category}</span>
            {credibilityScore && (
                <Badge variant="outline" className={`text-xs ${getCredibilityColor(credibilityScore)}`}>
                    Credibility: {(credibilityScore * 100).toFixed(0)}%
                </Badge>
            )}
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg font-bold mt-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors">
            {showHindi && headline_hi ? headline_hi : title}
          </h3>
        </a>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
          {showHindi && summary_hi ? summary_hi : summary}
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

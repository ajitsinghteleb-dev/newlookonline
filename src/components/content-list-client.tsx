'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Globe, Filter } from 'lucide-react';
import { ContentCard } from './content-card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { ContentItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const regions = [
  { value: 'all', label: 'All Regions' },
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'global', label: '🌍 Global' },
];

export function ContentListClient({ items }: { items: ContentItem[] }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    const regionFromQuery = searchParams.get('region');
    if (regionFromQuery && regions.some(r => r.value === regionFromQuery)) {
      setSelectedRegion(regionFromQuery);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesRegion =
        selectedRegion === 'all' || item.region === selectedRegion;
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.companyName && item.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesRegion && matchesSearch;
    });
  }, [items, searchTerm, selectedRegion]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 p-4 bg-card rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, description, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="relative flex items-center">
             <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="pl-10 h-12 text-base">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <ContentCard item={item} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <p className="text-xl text-muted-foreground">No items found.</p>
              <p className="mt-2">Try adjusting your search or filter.</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

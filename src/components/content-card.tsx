import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContentItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

function getBadgeVariant(type: ContentItem['type']) {
  switch (type) {
    case 'news':
      return 'default';
    case 'job':
      return 'secondary';
    case 'tender':
      return 'outline';
    default:
      return 'default';
  }
}

export function ContentCard({ item }: { item: ContentItem }) {
  const timeAgo = formatDistanceToNow(new Date(item.date), { addSuffix: true });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="relative aspect-video mb-4">
          <Image
            src={item.imageUrl}
            alt={item.seo.image_alt_text}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={item.imageHint}
          />
        </div>
        <div className="flex justify-between items-start">
          <Badge variant={getBadgeVariant(item.type)} className="capitalize">
            {item.type}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
        <CardTitle className="font-headline pt-2">
          <Link
            href={`/${item.type}/${item.seo.url_slug}`}
            className="hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {item.location && (
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
        )}
         <Link
            href={`/${item.type}/${item.seo.url_slug}`}
            className="text-sm font-semibold text-primary hover:text-accent flex items-center gap-1"
          >
            Read More <ArrowUpRight className="w-4 h-4" />
          </Link>
      </CardFooter>
    </Card>
  );
}

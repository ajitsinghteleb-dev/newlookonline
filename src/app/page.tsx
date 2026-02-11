import { Newspaper, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';

import { getLatestContent } from '@/lib/data';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ContentItem } from '@/lib/types';
import Image from 'next/image';
import heroImage from '@/lib/hero-image.json';

function HeroSection() {
  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] text-white">
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.imageHint}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
          LookOnline Global
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-3xl drop-shadow-md">
          Your automated portal for the latest News, Jobs, and Tenders worldwide.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/news">
              <Newspaper className="mr-2 h-5 w-5" /> Explore News
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/jobs">
              <Briefcase className="mr-2 h-5 w-5" /> Find Jobs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ContentSection({
  title,
  icon,
  items,
  type,
}: {
  title: string;
  icon: React.ReactNode;
  items: ContentItem[];
  type: 'news' | 'jobs' | 'tenders';
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl flex items-center gap-3">
            {icon}
            {title}
          </h2>
          <Button asChild variant="link" className="text-primary hover:text-accent">
            <Link href={`/${type}`}>View All &rarr;</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { news, jobs, tenders } = getLatestContent(3);

  return (
    <div>
      <HeroSection />

      <ContentSection
        title="Latest News"
        icon={<Newspaper className="h-8 w-8 text-primary" />}
        items={news}
        type="news"
      />

      <ContentSection
        title="Featured Jobs"
        icon={<Briefcase className="h-8 w-8 text-primary" />}
        items={jobs}
        type="jobs"
      />

      <ContentSection
        title="New Tenders"
        icon={<FileText className="h-8 w-8 text-primary" />}
        items={tenders}
        type="tenders"
      />
    </div>
  );
}

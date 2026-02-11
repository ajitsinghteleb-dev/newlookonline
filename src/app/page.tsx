'use client';

import { Newspaper, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';

import { getLatestContent } from '@/lib/data';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import type { ContentItem } from '@/lib/types';
import Image from 'next/image';
import heroImage from '@/lib/hero-image.json';
import { SeedDataButton } from '@/components/seed-data-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] text-white">
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.imageHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-4 pb-16 md:pb-24">
        <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg leading-tight">
          The Future of Information is Here
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-3xl text-muted-foreground drop-shadow-md">
          LookOnline Global: Your AI-powered nexus for real-time News, strategic Career opportunities, and global Tenders.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/categories">
              <Newspaper className="mr-2 h-5 w-5" /> Explore Categories
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/jobs">
              <Briefcase className="mr-2 h-5 w-5" /> Find Careers
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
  isLoading,
}: {
  title: string;
  icon: React.ReactNode;
  items: ContentItem[];
  type: 'news' | 'job' | 'tender';
  isLoading: boolean;
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
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[225px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            : items.map((item) => <ContentCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [content, setContent] = useState<{
    news: ContentItem[];
    jobs: ContentItem[];
    tenders: ContentItem[];
  }>({ news: [], jobs: [], tenders: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (firestore) {
      const fetchContent = async () => {
        setIsLoading(true);
        try {
          const latestContent = await getLatestContent(firestore, 3);
          setContent(latestContent);
        } catch (error) {
          console.error("Failed to fetch latest content:", error);
          toast({
            variant: "destructive",
            title: "Error fetching content",
            description: "Could not load latest news, jobs, and tenders. Please check your connection and permissions.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();
    }
  }, [firestore, toast]);

  return (
    <div>
      <HeroSection />

      <div className="container px-4 md:px-6 my-4">
        <SeedDataButton />
      </div>

      <ContentSection
        title="Latest News"
        icon={<Newspaper className="h-8 w-8 text-primary" />}
        items={content.news}
        type="news"
        isLoading={isLoading}
      />

      <ContentSection
        title="Featured Jobs"
        icon={<Briefcase className="h-8 w-8 text-primary" />}
        items={content.jobs}
        type="jobs"
        isLoading={isLoading}
      />

      <ContentSection
        title="New Tenders"
        icon={<FileText className="h-8 w-8 text-primary" />}
        items={content.tenders}
        type="tender"
        isLoading={isLoading}
      />
    </div>
  );
}

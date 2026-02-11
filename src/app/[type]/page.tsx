import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContentByType } from '@/lib/data';
import { ContentListClient } from '@/components/content-list-client';
import type { ContentType } from '@/lib/types';
import { Suspense } from 'react';

type Props = {
  params: { type: string };
};

const VALID_TYPES: ContentType[] = ['news', 'job', 'tender'];

function getTitle(type: ContentType) {
  switch (type) {
    case 'news':
      return 'Latest News';
    case 'job':
      return 'Job Openings';
    case 'tender':
      return 'Available Tenders';
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = params.type as ContentType;
  if (!VALID_TYPES.includes(type)) {
    return { title: 'Not Found' };
  }
  const title = getTitle(type);
  return {
    title,
    description: `Browse all ${title} on LookOnline Global.`,
  };
}

export default async function ListPage({ params }: Props) {
  const type = params.type as ContentType;

  if (!VALID_TYPES.includes(type)) {
    notFound();
  }

  const items = await getContentByType(type);
  const title = getTitle(type);

  return (
    <>
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
                {title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Browse, search, and filter all {type} listings.
            </p>
        </div>
      </div>
      <Suspense>
        <ContentListClient items={items} />
      </Suspense>
    </>
  );
}

export function generateStaticParams() {
    return VALID_TYPES.map(type => ({ type }));
}

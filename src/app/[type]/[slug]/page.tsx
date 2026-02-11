import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  DollarSign,
  Building,
  FileText,
  Tag,
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';

import { getItemBySlug, getAllContent } from '@/lib/data';
import type { ContentType, ContentItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SeoSchema } from '@/components/seo-schema';

type Props = {
  params: {
    type: string;
    slug: string;
  };
};

const VALID_TYPES: ContentType[] = ['news', 'job', 'tender'];

export async function generateStaticParams() {
  const content = getAllContent();
  return content.map((item) => ({
    type: item.type,
    slug: item.seo.url_slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type, slug } = params;
  if (!VALID_TYPES.includes(type as ContentType)) {
    return { title: 'Not Found' };
  }

  const item = getItemBySlug(type as ContentType, slug);

  if (!item) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  const { seo } = item;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://lookonline.in'}/${
    item.type
  }/${item.seo.url_slug}`;

  return {
    title: seo.meta_title,
    description: seo.meta_description,
    keywords: seo.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seo.meta_title,
      description: seo.meta_description,
      url: url,
      siteName: 'LookOnline Global',
      images: [
        {
          url: item.imageUrl,
          width: 800,
          height: 600,
          alt: seo.image_alt_text,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.meta_title,
      description: seo.meta_description,
      images: [item.imageUrl],
    },
  };
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-center text-muted-foreground">
      <Icon className="h-4 w-4 mr-2 text-primary" />
      <span className="font-medium text-foreground">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  )
}

export default async function DetailPage({ params }: Props) {
  const { type, slug } = params;

  if (!VALID_TYPES.includes(type as ContentType)) {
    notFound();
  }

  const item = getItemBySlug(type as ContentType, slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <SeoSchema item={item} />
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-4 mb-8">
          <Badge className="capitalize">{item.type}</Badge>
          <h1 className="text-3xl md:text-5xl font-headline font-bold">
            {item.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={item.imageUrl}
            alt={item.seo.image_alt_text}
            fill
            className="object-cover"
            priority
            data-ai-hint={item.imageHint}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-h2:text-2xl prose-h3:text-xl"
              dangerouslySetInnerHTML={{ __html: item.seo.content_structure }}
            />
          </div>
          <aside className="md:col-span-1 space-y-6">
            <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-headline text-lg font-semibold mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <DetailItem icon={Calendar} label="Published" value={format(new Date(item.date), 'MMMM d, yyyy')} />
                  <DetailItem icon={Globe} label="Region" value={item.region.toUpperCase()} />
                  {item.type === 'job' && (
                    <>
                      <DetailItem icon={Building} label="Company" value={item.companyName} />
                      <DetailItem icon={MapPin} label="Location" value={item.location} />
                      <DetailItem icon={DollarSign} label="Salary" value={item.salary} />
                    </>
                  )}
                  {item.type === 'tender' && (
                    <>
                      <DetailItem icon={FileText} label="Value" value={item.tenderValue} />
                      <DetailItem icon={Calendar} label="Closing" value={item.closingDate ? format(new Date(item.closingDate), 'MMMM d, yyyy') : undefined} />
                    </>
                  )}
                </div>
            </div>
            
            <div className="p-4 bg-card rounded-lg border">
              <h3 className="font-headline text-lg font-semibold mb-4 flex items-center">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                Tags
                </h3>
              <div className="flex flex-wrap gap-2">
                {item.seo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

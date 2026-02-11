import { getNewsBySlug, getAllNewsSlugs } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ShareButtons from '@/components/ShareButtons';
import AdComponent from '@/components/AdComponent';
import { NewsArticle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

// Generate static pages for all news articles at build time
export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map(({ slug }) => ({
    slug,
  }));
}

// Generate dynamic SEO metadata for each news article
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const news = await getNewsBySlug(params.slug);
    if (!news) {
        return {
            title: 'Not Found'
        }
    }
    return {
        title: news.title,
        description: news.summary,
        openGraph: {
            title: news.title,
            description: news.summary,
        },
    };
}

// The main component for displaying a news article
export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    const news = await getNewsBySlug(params.slug) as NewsArticle;

    if (!news) {
        notFound();
    }

    // JSON-LD for Google News Robot
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": news.title,
        "datePublished": new Date(news.timestamp.seconds * 1000).toISOString(),
        "author": { "@type": "Organization", "name": "LookOnline" },
        "publisher": {
            "@type": "Organization",
            "name": "LookOnline",
        },
        "description": news.summary,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-background">
                <div className="container mx-auto px-4 py-8 lg:py-16">
                    <article className="max-w-4xl mx-auto">
                        <header className="mb-8">
                            <span className="text-sm font-bold uppercase text-red-600 tracking-wider">{news.category}</span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground my-4">
                                {news.title}
                            </h1>
                            <div className="flex items-center justify-between text-sm text-muted-foreground border-y py-3">
                                <span>{new Date(news.timestamp.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <ShareButtons title={news.title} url={`https://www.lookonline.in/news/${news.urlSlug}`} />
                            </div>
                        </header>

                        <div className="prose dark:prose-invert max-w-none text-lg">
                           <p className="lead text-xl text-muted-foreground">{news.summary}</p>
                           
                           {news.summary_hi && (
                               <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                                   <h3 className="font-bold not-prose">सारांश</h3>
                                   <p>{news.summary_hi}</p>
                               </div>
                           )}
                        </div>
                        
                        <footer className="mt-12 pt-8 border-t border-border">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">Hashtags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {news.hashtags?.map(tag => (
                                            <span key={tag} className="text-sm text-muted-foreground">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <Button asChild variant="outline">
                                    <a href={news.link} target="_blank" rel="noopener noreferrer">
                                        Read Original Story <ExternalLink className="ml-2"/>
                                    </a>
                                </Button>
                            </div>
                        </footer>
                    </article>
                    
                    <div className="max-w-4xl mx-auto mt-16">
                        <AdComponent />
                    </div>
                </div>
            </div>
        </>
    );
}

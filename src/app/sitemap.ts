import { MetadataRoute } from 'next';
import { getAllContent } from '@/lib/data';

const BASE_URL = 'https://www.lookonline.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const content = await getAllContent();

    const contentUrls: MetadataRoute.Sitemap = content.map(item => ({
        url: `${BASE_URL}/${item.type}/${item.url_slug}`,
        lastModified: item.date,
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    const staticUrls: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/tenders`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/advertise`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];
    
    return [
        ...staticUrls,
        ...contentUrls
    ];
}

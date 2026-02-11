import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.lookonline.in';
  
  return {
    rules: [
        {
            userAgent: '*',
            allow: ['/', '/news/', '/jobs/', '/tenders/', '/resume', '/policy'],
            disallow: ['/admin/', '/api/'],
        }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

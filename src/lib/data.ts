import { getFirestoreAdmin } from '@/lib/firebase-server';
import type { NewsArticle } from './types';

export async function getAllContent(): Promise<{ type: string; url_slug: string; date: Date }[]> {
    const adminDb = getFirestoreAdmin();
    const content: { type: string; url_slug: string; date: Date }[] = [];
    
    try {
        const newsSnap = await adminDb.collection('news').orderBy('timestamp', 'desc').get();
        newsSnap.forEach(doc => {
            const data = doc.data();
            if (data.urlSlug && data.timestamp) {
              content.push({ type: 'news', url_slug: data.urlSlug, date: data.timestamp.toDate() });
            }
        });
    } catch (error) {
        console.error("Error fetching all content for sitemap:", error);
    }
    
    return content;
}

export async function getAllNewsSlugs(): Promise<{ slug: string }[]> {
    const adminDb = getFirestoreAdmin();
    const slugs: { slug: string }[] = [];
    try {
        const newsSnap = await adminDb.collection('news').select('urlSlug').get();
        newsSnap.forEach(doc => {
            const data = doc.data();
            if (data.urlSlug) {
                slugs.push({ slug: data.urlSlug });
            }
        });
    } catch (error) {
        console.error("Error fetching news slugs:", error);
    }
    return slugs;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    const adminDb = getFirestoreAdmin();
    try {
        const querySnapshot = await adminDb.collection('news').where('urlSlug', '==', slug).limit(1).get();
        if (querySnapshot.empty) {
            console.warn(`No news article found for slug: ${slug}`);
            return null;
        }
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as NewsArticle;
    } catch (error) {
        console.error(`Error fetching news by slug ${slug}:`, error);
        return null;
    }
}

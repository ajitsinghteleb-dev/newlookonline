import { getFirestoreAdmin } from '@/lib/firebase-server';
import type { NewsArticle, JobPosting, Tender } from './types';

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

export async function getJobs(): Promise<JobPosting[]> {
    const adminDb = getFirestoreAdmin();
    try {
        const snap = await adminDb.collection('jobs').orderBy('posted_at', 'desc').get();
        if (snap.empty) {
            return [];
        }
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPosting));
    } catch (error) {
        console.error(`Error fetching jobs:`, error);
        return [];
    }
}

export async function getTenders(): Promise<Tender[]> {
    const adminDb = getFirestoreAdmin();
    try {
        const snap = await adminDb.collection('tenders').orderBy('closingDate', 'desc').get();
        if (snap.empty) {
            return [];
        }
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tender));
    } catch (error) {
        console.error(`Error fetching tenders:`, error);
        return [];
    }
}

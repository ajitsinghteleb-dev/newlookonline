import { getFirestoreAdmin } from '@/lib/firebase-server';

export async function getAllContent(): Promise<{ type: string; seo: { url_slug: string }; date: Date }[]> {
    const adminDb = getFirestoreAdmin();
    const content: { type: string; seo: { url_slug: string }; date: Date }[] = [];
    
    try {
        const newsSnap = await adminDb.collection('news').get();
        newsSnap.forEach(doc => {
            const data = doc.data();
            content.push({ type: 'news', seo: { url_slug: data.urlSlug || doc.id }, date: data.timestamp?.toDate() || new Date() });
        });

        const jobsSnap = await adminDb.collection('jobs').get();
        jobsSnap.forEach(doc => {
            const data = doc.data();
            content.push({ type: 'jobs', seo: { url_slug: data.urlSlug || doc.id }, date: data.posted_at?.toDate() || new Date() });
        });

        const tendersSnap = await adminDb.collection('tenders').get();
        tendersSnap.forEach(doc => {
            const data = doc.data();
            content.push({ type: 'tenders', seo: { url_slug: data.urlSlug || doc.id }, date: data.closingDate?.toDate() || new Date() });
        });
    } catch (error) {
        console.error("Error fetching all content for sitemap:", error);
    }
    
    return content;
}

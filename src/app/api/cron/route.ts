// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { getFirestoreAdmin } from '@/lib/firebase-server';
import { processNewsArticle } from '@/ai/flows/process-news-article';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

const parser = new Parser();

const NEWS_SOURCES = [
    {url: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en", region: "IN"},
    {url: "https://feeds.feedburner.com/TechCrunch/", region: "GLOBAL"}
];

export async function GET() {
    const db = getFirestoreAdmin();
    console.log("📰 Cron Job: Scanning News...");

    const results = {
        scanned: 0,
        added: 0,
        errors: 0,
    };

    for (const source of NEWS_SOURCES) {
        try {
            const feed = await parser.parseURL(source.url);
            
            // Process only the latest 5 items from each feed to manage costs and time
            for (const entry of feed.items.slice(0, 5)) {
                if (!entry.link) continue;
                results.scanned++;

                const docId = createHash('md5').update(entry.link).digest('hex');
                const docRef = db.collection("news").doc(docId);

                const docSnapshot = await docRef.get();
                if (docSnapshot.exists) {
                    console.log(`- Skipping existing article: ${entry.title}`);
                    continue;
                }

                console.log(`+ Processing new article: ${entry.title}`);

                // AI Processing
                const processedData = await processNewsArticle({
                    title: entry.title || '',
                    summary: entry.contentSnippet || entry.content || '',
                });

                if (!processedData) {
                    results.errors++;
                    console.error(`- AI processing failed for: ${entry.title}`);
                    continue;
                }

                const newArticle = {
                    id: docId,
                    title: processedData.headline,
                    headline_hi: processedData.headline_hi,
                    summary: processedData.summary,
                    summary_hi: processedData.summary_hi,
                    category: processedData.category,
                    region: source.region,
                    link: entry.link,
                    timestamp: new Date(),
                    status: 'published',
                    urlSlug: processedData.url_slug,
                    credibilityScore: processedData.credibilityScore,
                    hashtags: processedData.hashtags || [],
                };

                await docRef.set(newArticle);
                results.added++;
                console.log(`✅ Saved News: ${processedData.headline}`);
            }
        } catch (error) {
            results.errors++;
            console.error(`❌ Error fetching feed from ${source.url}:`, error);
        }
    }

    console.log(`✅ Cron Job Complete. Scanned: ${results.scanned}, Added: ${results.added}, Errors: ${results.errors}`);
    
    return NextResponse.json({
        message: "News cron job executed successfully.",
        ...results
    });
}

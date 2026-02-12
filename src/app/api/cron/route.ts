
// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { getFirestoreAdmin } from '@/lib/firebase-server';
import { processNewsArticle } from '@/ai/flows/process-news-article';
import { processJobPosting } from '@/ai/flows/process-job-posting';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

const parser = new Parser();

// --- CONFIGURATION ---
const NEWS_SOURCES = [
    // Trending in India
    { url: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en", region: "IN" },
    // Global Trending
    { url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", region: "GLOBAL" },
    // Trusted Global Sources
    { url: "http://feeds.bbci.co.uk/news/world/rss.xml", region: "GLOBAL" },
    { url: "https://feeds.reuters.com/Reuters/worldNews", region: "GLOBAL" },
    // Trusted Indian Source
    { url: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms", region: "IN" }
];

const JOB_SOURCES = [
    // Using Google News as a proxy for job feeds
    { url: "https://news.google.com/rss/search?q=hiring+OR+jobs+in+India&hl=en-IN&gl=IN&ceid=IN:en", source: "External" }
];

const TENDER_SOURCES = [
    { url: "https://etenders.gov.in/eprocure/app?page=RSS&service=page", source: "CPPP" }
];

const MAX_ITEMS_PER_FEED = 5; // To manage costs and processing time

// --- HELPER FUNCTIONS ---

/**
 * Creates a unique, consistent ID for a given link.
 */
const createDocId = (link: string): string => {
    return createHash('md5').update(link).digest('hex');
};

// --- BOT PROCESSORS ---

/**
 * Scans, processes with AI, and saves news articles.
 */
async function processNewsFeeds() {
    const db = getFirestoreAdmin();
    const results = { added: 0, errors: 0, scanned: 0 };
    console.log("📰 Scanning News...");

    for (const source of NEWS_SOURCES) {
        try {
            const feed = await parser.parseURL(source.url);
            for (const entry of feed.items.slice(0, MAX_ITEMS_PER_FEED)) {
                if (!entry.link) continue;
                results.scanned++;

                const docId = createDocId(entry.link);
                const docRef = db.collection("news").doc(docId);
                if ((await docRef.get()).exists) continue;

                console.log(`+ Processing News: ${entry.title}`);
                const processedData = await processNewsArticle({
                    title: entry.title || '',
                    summary: entry.contentSnippet || entry.content || '',
                });

                if (!processedData) {
                    results.errors++;
                    console.error(`- AI processing failed for: ${entry.title}`);
                    continue;
                }

                await docRef.set({
                    id: docId,
                    title: processedData.headline,
                    headline_hi: processedData.headline_hi,
                    summary: processedData.summary,
                    summary_hi: processedData.summary_hi,
                    category: processedData.category,
                    region: source.region,
                    link: entry.link,
                    timestamp: new Date(entry.pubDate || Date.now()),
                    status: 'published',
                    urlSlug: processedData.url_slug,
                    credibilityScore: processedData.credibilityScore,
                    hashtags: processedData.hashtags || [],
                    is_ai_generated: true,
                });
                results.added++;
            }
        } catch (error) {
            results.errors++;
            console.error(`❌ Error fetching news feed from ${source.url}:`, error);
        }
    }
    console.log(`✅ News Scan Complete. Added: ${results.added}, Scanned: ${results.scanned}, Errors: ${results.errors}`);
    return results;
}

/**
 * Scans, processes with AI, and saves job postings.
 */
async function processJobFeeds() {
    const db = getFirestoreAdmin();
    const results = { added: 0, errors: 0, scanned: 0 };
    console.log("💼 Scanning Jobs...");

    for (const source of JOB_SOURCES) {
        try {
            const feed = await parser.parseURL(source.url);
            for (const entry of feed.items.slice(0, MAX_ITEMS_PER_FEED)) {
                if (!entry.link) continue;
                results.scanned++;

                const docId = createDocId(entry.link);
                const docRef = db.collection("jobs").doc(docId);
                if ((await docRef.get()).exists) continue;
                
                console.log(`+ Processing Job: ${entry.title}`);

                // AI-powered skill extraction
                const processedData = await processJobPosting({
                    title: entry.title || '',
                    description: entry.contentSnippet || entry.content || '',
                });
                
                await docRef.set({
                    id: docId,
                    title: entry.title,
                    company: entry.creator || "Various",
                    source: source.source,
                    link: entry.link,
                    posted_at: new Date(entry.pubDate || Date.now()),
                    is_active: true,
                    skills: processedData?.skills || [], // Save extracted skills
                });
                results.added++;
            }
        } catch (error) {
            results.errors++;
            console.error(`❌ Error fetching job feed from ${source.url}:`, error);
        }
    }
    console.log(`✅ Job Scan Complete. Added: ${results.added}, Scanned: ${results.scanned}, Errors: ${results.errors}`);
    return results;
}


/**
 * Scans and saves tender information.
 */
async function processTenderFeeds() {
    const db = getFirestoreAdmin();
    const results = { added: 0, errors: 0, scanned: 0 };
    console.log("📄 Scanning Tenders...");

    for (const source of TENDER_SOURCES) {
        try {
            const feed = await parser.parseURL(source.url);
            for (const entry of feed.items.slice(0, MAX_ITEMS_PER_FEED)) {
                if (!entry.link) continue;
                results.scanned++;

                const docId = createDocId(entry.link);
                const docRef = db.collection("tenders").doc(docId);
                if ((await docRef.get()).exists) continue;
                
                console.log(`+ Processing Tender: ${entry.title}`);

                // Extract details from HTML content
                const content = entry.content || '';
                const closingDateMatch = content.match(/Closing Date\s*:\s*(\d{2}-[a-zA-Z]{3}-\d{4}\s\d{2}:\d{2}\s[AP]M)/);
                const tenderValueMatch = content.match(/Tender Value in ₹\s*:\s*([\d,]+(\.\d{2})?)/);
                
                await docRef.set({
                    id: docId,
                    title: entry.title,
                    organization: entry.creator || "Unknown",
                    description: entry.contentSnippet,
                    url: entry.link,
                    closingDate: closingDateMatch ? new Date(closingDateMatch[1]) : new Date(),
                    tenderValue: tenderValueMatch ? tenderValueMatch[1] : "N/A",
                });
                results.added++;
            }
        } catch (error) {
            results.errors++;
            console.error(`❌ Error fetching tender feed from ${source.url}:`, error);
        }
    }
    console.log(`✅ Tender Scan Complete. Added: ${results.added}, Scanned: ${results.scanned}, Errors: ${results.errors}`);
    return results;
}


// --- MAIN CRON HANDLER ---

export async function GET() {
    console.log("🤖 Cron Job Started: Running all bots...");

    const [newsResult, jobsResult, tendersResult] = await Promise.allSettled([
        processNewsFeeds(),
        processJobFeeds(),
        processTenderFeeds()
    ]);

    const finalResults = {
        news: newsResult.status === 'fulfilled' ? newsResult.value : { error: (newsResult.reason as Error)?.message || newsResult.reason },
        jobs: jobsResult.status === 'fulfilled' ? jobsResult.value : { error: (jobsResult.reason as Error)?.message || jobsResult.reason },
        tenders: tendersResult.status === 'fulfilled' ? tendersResult.value : { error: (tendersResult.reason as Error)?.message || tendersResult.reason },
    };

    console.log("🤖 Cron Job Finished.", finalResults);
    
    return NextResponse.json({
        message: "All bots executed successfully.",
        results: finalResults,
    });
}

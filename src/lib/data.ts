import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  DocumentData,
  doc,
  getDoc,
  Firestore,
} from 'firebase/firestore';
import { db } from '@/lib/firebase-server';
import type { ContentItem, ContentType, SEO_Metadata, Region } from './types';
import { cache } from 'react';

// This is a simplified in-memory "database".
// In a real application, this would be a connection to Firestore,
// and the AI-generated SEO data would be pre-populated by a Python script.

const getDb = cache(() => {
  return db;
});

const COLLECTION_NAMES: Record<ContentType, string> = {
  news: 'news_articles',
  job: 'job_postings',
  tender: 'tenders',
};

function docToContentItem(
  doc: DocumentData,
  type: ContentType
): ContentItem {
  const data = doc.data();
  // This is a bit of a hack to make the data conform to the ContentItem type
  // In a real app, you'd want to have a more robust data mapping layer.
  return {
    id: doc.id,
    type: type,
    region: data.region,
    title: data.title,
    description: data.metaDescription,
    content: data.content,
    imageUrl: data.imageUrl,
    imageHint: '', // This should be stored in the DB as well
    date: data.publishedAt || data.postedDate || data.closingDate,
    source: data.source || '',
    seo: {
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,
      tags: data.tags,
      image_alt_text: data.imageAltText,
      url_slug: data.urlSlug,
      content_structure: data.content_structure,
    },
    // Job specific
    companyName: data.company,
    location: data.location,
    salary: data.salary,
    // Tender specific
    tenderValue: data.tenderValue,
    closingDate: data.closingDate,
  };
}

// --- Data Access Functions ---

export const getAllContent = cache(
  async (type?: ContentType): Promise<ContentItem[]> => {
    const db = getDb();
    let typesToFetch: ContentType[] = type ? [type] : ['news', 'job', 'tender'];

    const allContent: ContentItem[] = [];

    for (const t of typesToFetch) {
      const collectionName = COLLECTION_NAMES[t];
      const q = query(collection(db, collectionName));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allContent.push(docToContentItem(doc, t));
      });
    }

    return allContent;
  }
);

export const getContentByType = cache(
  async (type: ContentType): Promise<ContentItem[]> => {
    return getAllContent(type);
  }
);

export const getItemBySlug = cache(
  async (
    type: ContentType,
    slug: string
  ): Promise<ContentItem | undefined> => {
    const db = getDb();
    const collectionName = COLLECTION_NAMES[type];
    const q = query(
      collection(db, collectionName),
      where('urlSlug', '==', slug),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return undefined;
    }

    return docToContentItem(querySnapshot.docs[0], type);
  }
);

export const getLatestContent = async (
  db: Firestore,
  count: number
): Promise<{ news: ContentItem[]; jobs: ContentItem[]; tenders: ContentItem[] }> => {
  const fetchLatest = async (type: ContentType, dateField: string) => {
    const collectionName = COLLECTION_NAMES[type];
    const q = query(collection(db, collectionName), orderBy(dateField, 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => docToContentItem(doc, type));
  }

  const [news, jobs, tenders] = await Promise.all([
    fetchLatest('news', 'publishedAt'),
    fetchLatest('job', 'postedDate'),
    fetchLatest('tender', 'closingDate'),
  ]);

  return { news, jobs, tenders };
};

// Raw content for seeding
export const rawContent: Omit<ContentItem, 'seo' | 'id' | 'imageUrl' | 'imageHint' | 'date'>[] = [
  {
    type: 'news',
    region: 'us',
    title: 'Tech Giants Announce Major Breakthrough in Quantum Computing',
    description: 'A coalition of leading tech companies has revealed a new quantum processor that could revolutionize industries from medicine to finance.',
    content: 'The processor, named "Odyssey", is said to be 1000 times more powerful than any existing quantum computer. This could accelerate drug discovery, create unbreakable encryption, and develop new financial models.',
    source: 'Tech Chronicle',
  },
  {
    type: 'job',
    region: 'us',
    title: 'Senior Frontend Engineer (React)',
    description: 'Join our innovative team to build next-generation web applications. We are looking for a skilled developer with 5+ years of experience in React and TypeScript.',
    content: 'Responsibilities include developing new user-facing features, building reusable components, and optimizing applications for maximum speed and scalability. Experience with Next.js is a plus.',
    companyName: 'Innovate Inc.',
    location: 'San Francisco, CA (Remote)',
    salary: '$150,000 - $180,000',
  },
  {
    type: 'tender',
    region: 'in',
    title: 'Development of a Smart City Dashboard for Mumbai',
    description: 'The Municipal Corporation of Greater Mumbai invites proposals for the design, development, and implementation of a real-time smart city dashboard.',
    content: 'The project aims to integrate data from various city services like traffic, water supply, and waste management into a unified platform for monitoring and decision-making.',
    source: 'MCGM Portal',
    tenderValue: '₹50 Crore',
    closingDate: '2024-12-31',
  },
  {
    type: 'news',
    region: 'in',
    title: 'RBI Keeps Repo Rate Unchanged Amid Inflation Concerns',
    description: 'The Reserve Bank of India\'s Monetary Policy Committee has decided to hold the key repo rate at 6.5% to combat persistent inflationary pressures.',
    content: 'The decision was widely expected by economists. The governor stated that the focus remains on withdrawing accommodation to ensure inflation aligns with the target while supporting growth.',
    source: 'Finance Times',
  },
    {
    type: 'job',
    region: 'gb',
    title: 'Data Scientist - Machine Learning',
    description: 'A leading fintech startup in London is seeking a Data Scientist to develop machine learning models for fraud detection and credit scoring.',
    content: 'The ideal candidate will have a strong background in statistics, machine learning, and Python. Experience with deep learning frameworks like TensorFlow or PyTorch is highly desirable.',
    companyName: 'FinSecure Ltd.',
    location: 'London, UK',
    salary: '£70,000 - £90,000',
  },
  {
    type: 'tender',
    region: 'global',
    title: 'RFP for Global Logistics and Supply Chain Management Software',
    description: 'A multinational NGO is seeking proposals for a comprehensive logistics and supply chain management software solution to manage its global relief operations.',
    content: 'The solution must support inventory management, shipment tracking, warehouse management, and reporting across multiple countries and currencies.',
    source: 'Global Aid Network',
    closingDate: '2025-01-15',
  }
];

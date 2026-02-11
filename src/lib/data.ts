import { placeholderImages } from './placeholder-images.json';
import type { ContentItem, ContentType, SEO_Metadata, Region } from './types';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';

// This is a simplified in-memory "database".
// In a real application, this would be a connection to Firestore,
// and the AI-generated SEO data would be pre-populated by a Python script.
let contentItems: ContentItem[] = [];

// For demonstration, we'll generate SEO data on-the-fly for a few items.
// This simulates the data that the Python backend would have already processed.
const rawContent: Omit<ContentItem, 'seo' | 'id' | 'imageUrl' | 'imageHint' | 'date'>[] = [
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

// Helper to simulate slug generation
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');


async function initializeData() {
  if (contentItems.length > 0) return;

  console.log("Initializing mock data and generating SEO metadata...");

  const tempItems: ContentItem[] = [];
  let imageIndex = 0;

  for (const item of rawContent) {
    try {
        // In a real app, this would be fetched from the DB, not generated on the fly.
        const seo: SEO_Metadata = await generateSEOMetadata({
            content: item.content,
            contentType: item.type,
        });

        const image = placeholderImages[imageIndex % placeholderImages.length];
        
        tempItems.push({
            ...item,
            id: `${item.type}-${slugify(item.title)}`,
            seo: seo,
            imageUrl: image.imageUrl,
            imageHint: image.imageHint,
            date: new Date(Date.now() - imageIndex * 1000 * 60 * 60 * 24).toISOString(), // Stagger dates
        });

        imageIndex++;
    } catch(e) {
        console.error(`Failed to generate SEO for "${item.title}". Skipping item.`, e)
    }
  }
  contentItems = tempItems;
  console.log("Mock data initialization complete.");
}

// Ensure data is initialized before any export is used.
// This is a top-level await, which is fine in modern Node.js modules.
await initializeData();


// --- Data Access Functions ---

export function getAllContent(type?: ContentType) {
  if (type) {
    return contentItems.filter(item => item.type === type);
  }
  return contentItems;
}

export function getContentByType(type: ContentType) {
    return contentItems.filter(item => item.type === type);
}


export function getItemBySlug(type: ContentType, slug: string): ContentItem | undefined {
  return contentItems.find(item => item.type === type && item.seo.url_slug === slug);
}

export function getLatestContent(count: number) {
  const news = contentItems.filter(i => i.type === 'news').slice(0, count);
  const jobs = contentItems.filter(i => i.type === 'job').slice(0, count);
  const tenders = contentItems.filter(i => i.type === 'tender').slice(0, count);
  return { news, jobs, tenders };
}

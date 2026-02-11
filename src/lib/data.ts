import { placeholderImages } from '@/lib/placeholder-images.json';
import { slugify } from '@/lib/utils';
import type { ContentItem } from './types';

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

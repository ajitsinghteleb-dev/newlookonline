import { Timestamp } from 'firebase/firestore';

export interface NewsArticle {
    id: string;
    title: string;
    headline_hi: string;
    summary: string;
    summary_hi: string;
    category: "World" | "Business" | "Tech" | "Politics" | "Sports" | "Entertainment" | "Other";
    region: "IN" | "US" | "GLOBAL";
    link: string;
    timestamp: Timestamp;
    status: "published" | "draft";
    urlSlug: string;
    credibilityScore: number;
    hashtags: string[];
}

export interface JobPosting {
    id: string;
    title: string;
    company: string;
    source: string;
    link: string;
    posted_at: Timestamp;
    is_active: boolean;
    skills?: string[];
}

export interface Tender {
    id: string;
    title: string;
    organization: string;
    description: string;
    url: string;
    closingDate: Timestamp;
    tenderValue?: string;
}

export interface Ad {
    id: string;
    businessName: string;
    paymentUTR: string;
    bannerUrl: string;
    status: "pending" | "active" | "rejected";
    submittedAt: Timestamp;
}

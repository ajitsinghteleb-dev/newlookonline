export type ContentType = 'news' | 'job' | 'tender';
export type Region = 'us' | 'in' | 'gb' | 'global';

export type SEO_Metadata = {
  meta_title: string;
  meta_description: string;
  tags: string[];
  image_alt_text: string;
  url_slug: string;
  content_structure: string; // HTML string
};

export interface ContentItem {
  id: string;
  type: ContentType;
  region: Region;
  title: string;
  description: string;
  content: string; // Original content
  imageUrl: string;
  imageHint: string;
  date: string; // ISO 8601 format
  source: string; // e.g., "Google Trends", "API XYZ"
  seo: SEO_Metadata;
  // Job specific
  companyName?: string;
  location?: string;
  salary?: string;
  // Tender specific
  tenderValue?: string;
  closingDate?: string;
}

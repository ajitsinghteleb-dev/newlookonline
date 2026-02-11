# **App Name**: LookOnline Global

## Core Features:

- Automated News Aggregation: Fetch news trends from Google Trends for different regions (US, IN, Global).
- Automated Job Aggregation: Scrape jobs from trusted job APIs for different regions (US, IN).
- Automated Tender Aggregation: Scrape open tender portals to provide government and organizational opportunities.
- AI Content Optimization: Use Google Gemini Pro 1.5 or GPT-4o to process fetched trends, extracting keywords, generating URL slugs, meta descriptions, and structuring content with appropriate tags (H2, H3).
- Dynamic Schema Markup: Implement NewsArticle, JobPosting, GovernmentService, or Organization schema based on content type, crucial for Google Jobs sidebar. The LLM will act as a tool to decide which markup to use in different contexts.
- Sitemap Automation: Automatically generate sitemap.xml and robots.txt using next-sitemap, split by category (news, jobs, tenders).
- Global Region Switching: Allow users to switch regions (🇺🇸, 🇮🇳, 🇬🇧), storing the preference in a cookie. Use Elasticsearch or Algolia for instant filtering and search functionality.
- Firestore Integration: Store aggregated content, SEO metadata, and other relevant data in Google Cloud Firestore.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to convey trust and reliability in the information provided.
- Background color: A light, desaturated blue (#E5F5F9) to provide a clean and calm backdrop, ensuring readability.
- Accent color: A contrasting orange (#FF9933) for call-to-action buttons and important highlights.
- Headline font: 'Space Grotesk' sans-serif, for a modern, computerized feel.
- Body font: 'Inter' sans-serif, for clean readability in longer articles.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use a set of clear, professional icons to represent different categories of news, jobs, and tenders.
- Maintain a clean and structured layout with clear sections for different content types, ensuring ease of navigation.
- Incorporate subtle animations for loading new content and transitioning between sections to enhance user experience.
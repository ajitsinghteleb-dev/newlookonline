'use server';

/**
 * @fileOverview Processes a news article to generate a catchy headline, a summary, a category, and a Hindi translation of the headline.
 *
 * - processNewsArticle - A function that processes a news article.
 * - ProcessNewsArticleInput - The input type for the processNewsArticle function.
 * - ProcessNewsArticleOutput - The return type for the processNewsArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessNewsArticleInputSchema = z.object({
  title: z.string().describe('The original title of the news article.'),
  summary: z.string().describe('The original summary or content of the news article.'),
});
export type ProcessNewsArticleInput = z.infer<typeof ProcessNewsArticleInputSchema>;

const ProcessNewsArticleOutputSchema = z.object({
    category: z.enum(["World", "Business", "Tech", "Politics", "Sports", "Entertainment", "Other"]).describe('Categorize the news into one of the given categories.'),
    headline: z.string().describe('A catchy, rewritten headline for the article in English.'),
    headline_hi: z.string().describe('The rewritten headline, translated into Hindi.'),
    summary: z.string().describe('A 100-word summary of the article in English.'),
    summary_hi: z.string().describe('The 100-word summary, translated into Hindi.'),
    url_slug: z.string().describe('A clean, SEO-friendly, English URL slug for the article.'),
    credibilityScore: z.number().describe('A credibility score from 0.0 to 1.0 based on the source and content.'),
    hashtags: z.array(z.string()).describe('An array of 5 relevant hashtags for social media.'),
});
export type ProcessNewsArticleOutput = z.infer<typeof ProcessNewsArticleOutputSchema>;

export async function processNewsArticle(input: ProcessNewsArticleInput): Promise<ProcessNewsArticleOutput> {
  return processNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processNewsArticlePrompt',
  input: {schema: ProcessNewsArticleInputSchema},
  output: {schema: ProcessNewsArticleOutputSchema},
  prompt: `
    Act as a senior professional news editor for 'LookOnline'. 
    I will provide a raw news headline and snippet.
    
    RAW DATA:
    Headline: {{{title}}}
    Snippet: {{{summary}}}
    
    TASK:
    1. Humanize: Rewrite the headline and a 100-word summary in a neutral, professional, human-like tone. Avoid AI-sounding words like 'delve', 'unveiled', or 'testament'.
    2. Translate: Provide the exact same rewritten headline and summary in Hindi.
    3. Categorize: Assign one category (Politics, Tech, Business, Jobs, Sports, World, Entertainment, Other).
    4. SEO: Create a URL-friendly slug and 5 relevant hashtags.
    5. Credibility: Provide a credibility score from 0.0 (very untrustworthy) to 1.0 (very trustworthy) based on the likely reliability of the content.

    OUTPUT FORMAT (Strict JSON):
    {{
        "headline": "...",
        "summary": "...",
        "headline_hi": "...",
        "summary_hi": "...",
        "category": "...",
        "url_slug": "...",
        "credibilityScore": 0.0,
        "hashtags": ["#tag1", "#tag2"]
    }}
    `,
});

const processNewsArticleFlow = ai.defineFlow(
  {
    name: 'processNewsArticleFlow',
    inputSchema: ProcessNewsArticleInputSchema,
    outputSchema: ProcessNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

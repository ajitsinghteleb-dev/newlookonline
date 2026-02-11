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
    headline: z.string().describe('A catchy, rewritten headline for the article.'),
    headline_hi: z.string().describe('The rewritten headline, translated into Hindi.'),
    summary: z.string().describe('A 100-word summary of the article.'),
    summary_hi: z.string().describe('The 100-word summary, translated into Hindi.'),
    url_slug: z.string().describe('A clean, SEO-friendly, English URL slug for the article.'),
    credibilityScore: z.number().describe('A credibility score from 0.0 to 1.0 based on the source and content.'),
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
    Act as a Senior Editor for a fast-paced global news portal.
    You will be given the original title and summary of a news article.
    Your tasks are:
    1. Categorize the article into one of the following: "World", "Business", "Tech", "Politics", "Sports", "Entertainment", "Other".
    2. Rewrite the headline to be catchy, engaging, and SEO-friendly.
    3. Translate the new, rewritten headline into standard, formal Hindi.
    4. Generate a concise and compelling summary of about 100 words in English.
    5. Translate the new English summary into standard, formal Hindi.
    6. Generate a clean, SEO-friendly, English URL slug for the article.
    7. Provide a credibility score from 0.0 (very untrustworthy) to 1.0 (very trustworthy) based on the likely reliability of the content.

    ORIGINAL SOURCE:
    Title: {{{title}}}
    Summary: {{{summary}}}

    Generate a valid JSON object as output.
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

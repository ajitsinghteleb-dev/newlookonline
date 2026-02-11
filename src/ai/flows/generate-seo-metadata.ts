'use server';

/**
 * @fileOverview Generates SEO-optimized metadata for aggregated content.
 *
 * - generateSEOMetadata - A function that generates SEO metadata.
 * - GenerateSEOMetadataInput - The input type for the generateSEOMetadata function.
 * - GenerateSEOMetadataOutput - The return type for the generateSEOMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSEOMetadataInputSchema = z.object({
  content: z
    .string()
    .describe('The content to generate SEO metadata for, such as a news article, job description, or tender.'),
  contentType: z
    .enum(['news', 'job', 'tender'])
    .describe('The type of content: news, job, or tender.'),
});
export type GenerateSEOMetadataInput = z.infer<typeof GenerateSEOMetadataInputSchema>;

const GenerateSEOMetadataOutputSchema = z.object({
  meta_title: z.string().describe('The meta title for the content (max 60 chars, keyword-heavy).'),
  meta_description: z
    .string()
    .describe('The meta description for the content (max 160 chars, compelling click-through).'),
  tags: z.array(z.string()).describe('5-10 relevant hashtags.'),
  image_alt_text: z.string().describe('Descriptive text for the featured image.'),
  url_slug: z.string().describe('Clean, English URL slug for the content.'),
  content_structure: z
    .string()
    .describe('The rewritten body must use <h2> and <h3> tags containing the keywords naturally.'),
});
export type GenerateSEOMetadataOutput = z.infer<typeof GenerateSEOMetadataOutputSchema>;

export async function generateSEOMetadata(input: GenerateSEOMetadataInput): Promise<GenerateSEOMetadataOutput> {
  return generateSEOMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSEOMetadataPrompt',
  input: {schema: GenerateSEOMetadataInputSchema},
  output: {schema: GenerateSEOMetadataOutputSchema},
  prompt: `You are an SEO expert specializing in content optimization for news, jobs, and tenders.\n\nYou will receive content and its type (news, job, or tender). You will then generate SEO-optimized metadata for the content, including a meta title, meta description, tags, URL slug, and content structure with h2 and h3 tags.\n\nContent Type: {{{contentType}}}\nContent: {{{content}}}\n\nOutput a JSON object with the following fields:\n- meta_title: (Max 60 chars, keyword-heavy)\n- meta_description: (Max 160 chars, compelling click-through)\n- tags: 5-10 relevant hashtags\n- image_alt_text: Descriptive text for the featured image\n- url_slug: Clean, English URL slug\n- content_structure: The rewritten body must use <h2> and <h3> tags containing the keywords naturally\n\nEnsure the output is valid JSON.\n\n{
  "meta_title": "",
  "meta_description": "",
  "tags": [],
  "image_alt_text": "",
  "url_slug": "",
  "content_structure": ""
}
`,
});

const generateSEOMetadataFlow = ai.defineFlow(
  {
    name: 'generateSEOMetadataFlow',
    inputSchema: GenerateSEOMetadataInputSchema,
    outputSchema: GenerateSEOMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

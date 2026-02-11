// src/ai/flows/implement-dynamic-schema-markup.ts
'use server';
/**
 * @fileOverview Implements dynamic schema markup for content items using AI.
 *
 * - decideAndGenerateSchema - A function that determines the appropriate schema type and generates the schema.
 * - DecideAndGenerateSchemaInput - The input type for the decideAndGenerateSchema function.
 * - DecideAndGenerateSchemaOutput - The return type for the decideAndGenerateSchema function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecideAndGenerateSchemaInputSchema = z.object({
  contentType: z
    .enum(['news', 'job', 'tender'])
    .describe('The type of content: news, job, or tender.'),
  content: z.string().describe('The main content of the item.'),
  title: z.string().describe('The title of the content item.'),
  description: z.string().describe('A brief description of the content item.'),
  imageUrl: z.string().optional().describe('URL of the featured image.'),
  region: z.string().optional().describe('The region the content is relevant to (e.g., US, IN, Global).'),
});
export type DecideAndGenerateSchemaInput = z.infer<typeof DecideAndGenerateSchemaInputSchema>;

const DecideAndGenerateSchemaOutputSchema = z.object({
  schemaName: z.enum(['NewsArticle', 'JobPosting', 'GovernmentService', 'Organization']).describe('The selected schema name.'),
  schema: z.record(z.any()).describe('The generated JSON-LD schema.'),
});
export type DecideAndGenerateSchemaOutput = z.infer<typeof DecideAndGenerateSchemaOutputSchema>;

export async function decideAndGenerateSchema(input: DecideAndGenerateSchemaInput): Promise<DecideAndGenerateSchemaOutput> {
  return decideAndGenerateSchemaFlow(input);
}

const decideAndGenerateSchemaPrompt = ai.definePrompt({
  name: 'decideAndGenerateSchemaPrompt',
  input: {schema: DecideAndGenerateSchemaInputSchema},
  output: {schema: DecideAndGenerateSchemaOutputSchema},
  prompt: `You are an expert in generating JSON-LD schemas for various content types.

  Based on the content type, title, and description, determine the most appropriate schema type from the following options: NewsArticle, JobPosting, GovernmentService, Organization.

  Then generate a valid JSON-LD schema for the selected schema type using the provided content and metadata. Ensure all required fields for the schema are populated.

  Content Type: {{{contentType}}}
  Title: {{{title}}}
  Description: {{{description}}}
  Content: {{{content}}}
  Image URL: {{{imageUrl}}}
  Region: {{{region}}}

  Output the schema name and the generated JSON-LD schema.
  Ensure the schema is a valid JSON object.
  Make sure to include all relevant information such as title, description, and any dates if available.
`,
});

const decideAndGenerateSchemaFlow = ai.defineFlow(
  {
    name: 'decideAndGenerateSchemaFlow',
    inputSchema: DecideAndGenerateSchemaInputSchema,
    outputSchema: DecideAndGenerateSchemaOutputSchema,
  },
  async input => {
    const {output} = await decideAndGenerateSchemaPrompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI-powered resume enhancement tool.
 *
 * - buildResume - A function that rewrites experience and suggests keywords.
 * - BuildResumeInput - The input type for the buildResume function.
 * - BuildResumeOutput - The return type for the buildResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildResumeInputSchema = z.object({
  experience: z.string().describe('The user-provided plain text job experience.'),
});
export type BuildResumeInput = z.infer<typeof BuildResumeInputSchema>;

const BuildResumeOutputSchema = z.object({
  bulletPoints: z.array(z.string()).describe('An array of 3-5 professional, action-oriented bullet points.'),
  trendingKeywords: z.array(z.string()).describe('An array of 5 trending, high-impact keywords for the role.'),
});
export type BuildResumeOutput = z.infer<typeof BuildResumeOutputSchema>;

export async function buildResume(input: BuildResumeInput): Promise<BuildResumeOutput> {
  return buildResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildResumePrompt',
  input: {schema: BuildResumeInputSchema},
  output: {schema: BuildResumeOutputSchema},
  prompt: `You are an expert career coach and resume writer. A user will provide their job experience in plain text. Your task is to:
1.  Rewrite the experience into 3-5 professional, action-oriented bullet points suitable for a resume. Start each bullet point with an action verb.
2.  Suggest 5 trending, high-impact keywords relevant to the described role that the user should include in their resume.

User Experience:
{{{experience}}}

Output a valid JSON object with the following structure:
{
  "bulletPoints": ["..."],
  "trendingKeywords": ["..."]
}
`,
});

const buildResumeFlow = ai.defineFlow(
  {
    name: 'buildResumeFlow',
    inputSchema: BuildResumeInputSchema,
    outputSchema: BuildResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

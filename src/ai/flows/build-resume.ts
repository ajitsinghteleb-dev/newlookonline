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
  targetRole: z.string().describe('The job role the user is targeting.'),
});
export type BuildResumeInput = z.infer<typeof BuildResumeInputSchema>;

const BuildResumeOutputSchema = z.object({
  polishedPoints: z.array(z.string()).describe('An array of 3-4 professional, action-oriented bullet points using the STAR method.'),
  suggestedKeywords: z.array(z.string()).describe('An array of 5 trending, high-impact keywords for the role for 2026.'),
});
export type BuildResumeOutput = z.infer<typeof BuildResumeOutputSchema>;

export async function buildResume(input: BuildResumeInput): Promise<BuildResumeOutput> {
  return buildResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildResumePrompt',
  input: {schema: BuildResumeInputSchema},
  output: {schema: BuildResumeOutputSchema},
  prompt: `Act as an expert ATS Resume Writer.
Target Role: {{{targetRole}}}
Raw Experience: {{{experience}}}

Task:
1. Rewrite this experience into 3-4 professional bullet points using the STAR method.
2. Suggest 5 trending technical keywords for a {{{targetRole}}} in 2026.

Return ONLY JSON:
{
  "polishedPoints": ["...", "..."],
  "suggestedKeywords": ["...", "..."]
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

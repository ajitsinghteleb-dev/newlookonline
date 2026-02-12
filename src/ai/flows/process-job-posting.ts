'use server';

/**
 * @fileOverview Extracts relevant skills from a job posting.
 *
 * - processJobPosting - A function that extracts skills.
 * - ProcessJobPostingInput - The input type for the function.
 * - ProcessJobPostingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessJobPostingInputSchema = z.object({
  title: z.string().describe('The title of the job posting.'),
  description: z.string().describe('The description of the job posting.'),
});
export type ProcessJobPostingInput = z.infer<typeof ProcessJobPostingInputSchema>;

const ProcessJobPostingOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of 5-10 key technical and soft skills mentioned in the job description.'),
});
export type ProcessJobPostingOutput = z.infer<typeof ProcessJobPostingOutputSchema>;

export async function processJobPosting(input: ProcessJobPostingInput): Promise<ProcessJobPostingOutput> {
  return processJobPostingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processJobPostingPrompt',
  input: {schema: ProcessJobPostingInputSchema},
  output: {schema: ProcessJobPostingOutputSchema},
  prompt: `
    You are an expert technical recruiter.
    Analyze the following job posting and extract the top 5-10 most important skills.
    Focus on specific technologies, frameworks, and essential soft skills.

    Job Title: {{{title}}}
    Description: {{{description}}}

    Return ONLY a JSON object with a "skills" array.
    {{
      "skills": ["...", "...", "..."]
    }}
  `,
});

const processJobPostingFlow = ai.defineFlow(
  {
    name: 'processJobPostingFlow',
    inputSchema: ProcessJobPostingInputSchema,
    outputSchema: ProcessJobPostingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

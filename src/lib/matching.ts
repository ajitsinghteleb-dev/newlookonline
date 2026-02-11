/**
 * Calculates the match percentage between user skills and job requirements.
 * Uses a simple intersection logic: (Common Skills / Job Skills) * 100.
 */
export function calculateJobMatch(userSkills: string[], jobSkills: string[]): number {
  if (!jobSkills || jobSkills.length === 0 || !userSkills || userSkills.length === 0) return 0;
  
  const userSet = new Set(userSkills.map(s => s.toLowerCase().trim()).filter(Boolean));
  if (userSet.size === 0) return 0;

  const jobSkillSet = new Set(jobSkills.map(s => s.toLowerCase()));
  
  const matches = jobSkills.filter(skill => userSet.has(skill.toLowerCase()));
  
  const score = (matches.length / jobSkills.length) * 100;
  return Math.round(score);
}

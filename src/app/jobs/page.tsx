"use client";
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { JobPosting } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateJobMatch } from '@/lib/matching';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, "jobs"), orderBy("posted_at", "desc"));
        const snap = await getDocs(q);
        setJobs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPosting)));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const userSkillList = userSkills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Job Board</h1>
        <Link href="/employer" className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90 transition">Post a Job</Link>
      </div>

      <Card className="mb-8 bg-card/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Find Your Match</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2 text-sm">Enter your skills (comma-separated) to see how you match with job requirements.</p>
          <Input 
            placeholder="e.g., react, nodejs, python, sql" 
            value={userSkills}
            onChange={(e) => setUserSkills(e.target.value)}
            className="bg-background"
          />
        </CardContent>
      </Card>
      
      {loading && <div>Loading jobs...</div>}

      {!loading && (
        <div className="grid gap-4">
          {jobs.map(job => {
            const matchPercentage = calculateJobMatch(userSkillList, job.skills || []);
            return (
                <div key={job.id} className="bg-card p-6 rounded-lg shadow-md border flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                        {userSkills && (
                            <Badge variant={matchPercentage > 70 ? 'default' : matchPercentage > 40 ? 'secondary' : 'outline'} className="text-base">
                                {matchPercentage}% Match
                            </Badge>
                        )}
                    </div>

                    <p className="text-muted-foreground">{job.company}</p>
                    {job.skills && job.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.skills.map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <a href={job.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-foreground text-background px-4 py-2 rounded h-fit text-sm font-medium hover:bg-foreground/80 transition shrink-0 ml-4">
                    Apply
                  </a>
                </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

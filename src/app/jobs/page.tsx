"use client";
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { JobPosting } from '@/lib/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Job Board</h1>
        <Link href="/employer" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">Post a Job</Link>
      </div>
      
      {loading && <div>Loading jobs...</div>}

      {!loading && (
        <div className="grid gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{job.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <a href={job.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded h-fit text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition shrink-0 ml-4">
                Apply
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

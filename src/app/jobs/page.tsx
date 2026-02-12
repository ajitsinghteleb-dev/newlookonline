import { getJobs } from '@/lib/data';
import JobClientPage from './JobClientPage';

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      <JobClientPage initialJobs={jobs} />
    </div>
  );
}

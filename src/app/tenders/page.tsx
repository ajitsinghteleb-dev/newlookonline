import { getTenders } from '@/lib/data';
import TenderClientPage from './TenderClientPage';

export default async function TendersPage() {
  const tenders = await getTenders();

  return (
    <div className="container mx-auto px-4 py-8">
      <TenderClientPage initialTenders={tenders} />
    </div>
  );
}


"use client";
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import type { Tender } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, IndianRupee, Search } from 'lucide-react';

export default function TendersPage() {
  const firestore = useFirestore();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTenders = async () => {
      if (!firestore) return;
      try {
        const q = query(collection(firestore, "tenders"), orderBy("closingDate", "desc"));
        const snap = await getDocs(q);
        const tendersData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tender));
        setTenders(tendersData);
        setFilteredTenders(tendersData);
      } catch (error) {
        console.error("Error fetching tenders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, [firestore]);

  useEffect(() => {
    const results = tenders.filter(tender =>
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenders(results);
  }, [searchTerm, tenders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black">Active <span className="text-red-600">Tenders</span></h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search by Agency or Project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-card"
          />
        </div>
      </div>
      
      {loading && <div className="text-center">Loading tenders...</div>}

      {!loading && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tender Details</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Est. Value</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenders.length > 0 ? (
                filteredTenders.map(tender => (
                  <TableRow key={tender.id}>
                    <TableCell className="font-medium">
                      <p className="font-bold line-clamp-1">{tender.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Ref: {tender.id.slice(0,8)}</p>
                    </TableCell>
                    <TableCell className="font-medium text-gray-600 dark:text-gray-400">{tender.organization}</TableCell>
                    <TableCell>
                        {tender.tenderValue ? (
                             <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <IndianRupee size={12} /> {tender.tenderValue}
                             </Badge>
                        ) : <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        {tender.closingDate ? format(new Date(tender.closingDate.seconds * 1000), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost" className="text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <a href={tender.url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          View <ExternalLink size={14} />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No tenders found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

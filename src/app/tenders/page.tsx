"use client";
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
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

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const q = query(collection(db, "tenders"), orderBy("closingDate", "desc"));
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
  }, []);

  useEffect(() => {
    const results = tenders.filter(tender =>
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenders(results);
  }, [searchTerm, tenders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Tenders</h1>
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search by title or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card"
          />
        </div>
      </div>
      
      {loading && <div className="text-center">Loading tenders...</div>}

      {!loading && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenders.length > 0 ? (
                filteredTenders.map(tender => (
                  <TableRow key={tender.id}>
                    <TableCell className="font-medium">{tender.title}</TableCell>
                    <TableCell>{tender.organization}</TableCell>
                    <TableCell>
                        {tender.tenderValue ? (
                             <Badge variant="secondary">{tender.tenderValue}</Badge>
                        ) : <span className="text-muted-foreground">N/A</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        {tender.closingDate ? format(new Date(tender.closingDate.seconds * 1000), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <a href={tender.url || '#'} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No tenders found.
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

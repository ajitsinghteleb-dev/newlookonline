'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import {
  doc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';
import { rawContent } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { slugify } from '@/lib/utils';
import { Loader } from 'lucide-react';
import type { ContentType } from '@/lib/types';

const COLLECTION_NAMES: Record<ContentType, string> = {
    news: 'news_articles',
    job: 'job_postings',
    tender: 'tenders',
  };
  

export function SeedDataButton() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  // Check if data is already seeded
  useEffect(() => {
    const checkData = async () => {
      if (!firestore) return;
      try {
        const newsCollection = collection(firestore, 'news_articles');
        const snapshot = await getDocs(newsCollection);
        if (!snapshot.empty) {
          setIsSeeded(true);
        }
      } catch (error) {
        console.error('Error checking for existing data:', error);
      }
    };
    checkData();
  }, [firestore]);

  const handleSeed = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available.',
      });
      return;
    }

    setIsSeeding(true);
    toast({
      title: 'Seeding Database...',
      description:
        'This may take a minute. Please do not navigate away.',
    });

    try {
      const batch = writeBatch(firestore);
      let imageIndex = 0;

      for (const item of rawContent) {
        // Generate SEO metadata
        const seo = await generateSEOMetadata({
          content: item.content,
          contentType: item.type,
        });

        // Get placeholder image
        const image = placeholderImages[imageIndex % placeholderImages.length];

        const docId = `${slugify(item.title)}`;
        const collectionName = COLLECTION_NAMES[item.type];
        const docRef = doc(firestore, collectionName, docId);
        
        const date = new Date(Date.now() - imageIndex * 1000 * 60 * 60 * 24).toISOString();

        let dataToSet: any = {
          region: item.region,
          title: item.title,
          content: item.content,
          imageUrl: image.imageUrl,
          source: item.source,
          metaTitle: seo.meta_title,
          metaDescription: seo.meta_description,
          tags: seo.tags,
          imageAltText: seo.image_alt_text,
          urlSlug: seo.url_slug,
          content_structure: seo.content_structure,
        };

        if (item.type === 'news') {
            dataToSet.publishedAt = date;
        } else if (item.type === 'job') {
            dataToSet.company = item.companyName;
            dataToSet.location = item.location;
            dataToSet.salary = item.salary;
            dataToSet.postedDate = date;
        } else if (item.type === 'tender') {
            dataToSet.tenderValue = item.tenderValue;
            dataToSet.closingDate = item.closingDate || date;
        }

        batch.set(docRef, dataToSet);
        imageIndex++;
      }

      await batch.commit();

      toast({
        title: 'Success!',
        description: 'Database has been seeded with initial content.',
      });
      setIsSeeded(true);
    } catch (error: any) {
      console.error('Error seeding data:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'Could not seed the database.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isSeeded) {
    return (
      <p className="text-sm text-center text-muted-foreground p-4 bg-card rounded-md border">
        Database has been seeded. You can remove the SeedDataButton from the code.
      </p>
    );
  }

  return (
    <Button
      onClick={handleSeed}
      disabled={isSeeding || isSeeded}
      className="w-full"
    >
      {isSeeding ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        'Seed Database'
      )}
    </Button>
  );
}

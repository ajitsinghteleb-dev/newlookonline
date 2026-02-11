'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirebaseApp } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { Loader2, UploadCloud, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const adFormSchema = z.object({
  businessName: z.string().min(2, { message: 'Business name must be at least 2 characters.' }),
  paymentUTR: z.string().min(10, { message: 'Please enter a valid Payment ID/UTR.' }),
  banner: z.custom<FileList>().refine(files => files?.length > 0, 'A banner image is required.'),
});

type AdFormValues = z.infer<typeof adFormSchema>;

export default function AdvertisePage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const app = useFirebaseApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      businessName: '',
      paymentUTR: '',
    },
  });

  const onSubmit = async (data: AdFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to submit an ad.' });
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload banner to Firebase Storage
      const storage = getStorage(app);
      const file = data.banner[0];
      const storageRef = ref(storage, `ads/${user.uid}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const bannerUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create ad document in Firestore
      await addDoc(collection(db, 'ads'), {
        businessName: data.businessName,
        paymentUTR: data.paymentUTR,
        bannerUrl,
        status: 'pending',
        submittedAt: serverTimestamp(),
        userId: user.uid,
      });

      toast({
        title: 'Ad Submitted!',
        description: 'Your ad request has been sent for approval. It will be reviewed shortly.',
      });
      form.reset();
      router.push('/');
    } catch (error) {
      console.error('Ad submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }
  
  if (!user) {
    router.push('/login?redirect=/advertise');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
        <Card>
          <CardHeader>
            <CardTitle>Advertise with Us</CardTitle>
            <CardDescription>
              Submit your ad for review. Once approved, it will appear across our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentUTR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment ID (UTR/UPI Ref)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the transaction ID for your payment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Banner Image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/png, image/jpeg, image/gif" {...form.register('banner')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><UploadCloud className="mr-2 h-4 w-4" /> Submit for Approval</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
        <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><QrCode /> Pay with UPI</CardTitle>
                    <CardDescription>Scan the code below with any UPI app.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <Image 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=lookonline@oksbi&pn=LookOnline%20Global"
                        alt="UPI QR Code for lookonline@oksbi"
                        width={250}
                        height={250}
                        className="rounded-lg border p-2"
                        unoptimized
                    />
                    <p className="font-mono text-muted-foreground bg-muted px-4 py-2 rounded-lg text-sm">
                        lookonline@oksbi
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

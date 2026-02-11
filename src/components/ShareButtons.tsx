'use client';
import { Twitter, Linkedin, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
)

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = () => {
    if (!navigator.clipboard) {
      toast({
        variant: 'destructive',
        title: 'Clipboard not available',
        description: 'Copying to clipboard is not supported in this browser.',
      });
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'Link copied to clipboard!' });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy link to clipboard.',
      });
    });
  };

  return (
    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Twitter className="h-4 w-4" /></a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><FacebookIcon /></a>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Linkedin className="h-4 w-4" /></a>
        <button onClick={copyToClipboard} className="hover:text-primary"><Copy className="h-4 w-4" /></button>
    </div>
  );
}

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Your automated portal for the latest News, Jobs, and Tenders worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div>
              <h3 className="font-headline font-semibold mb-4">Content</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
                <li><Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">News</Link></li>
                <li><Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors">Jobs</Link></li>
                <li><Link href="/tenders" className="text-muted-foreground hover:text-primary transition-colors">Tenders</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" /></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} LookOnline Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

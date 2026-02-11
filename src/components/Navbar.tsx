"use client";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './logo';
import { Wand2 } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Logo />
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">News</Link>
          <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
          <Link href="/tenders" className="hover:text-primary transition-colors">Tenders</Link>
          <Link href="/resume" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Wand2 className="h-4 w-4"/>
            Resume Builder
          </Link>
          <Link href="/advertise" className="text-green-600 hover:text-green-500 font-bold">Advertise</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
          {user ? (
            <Link href="/admin" className="bg-foreground text-background px-4 py-2 rounded text-sm font-medium hover:bg-foreground/80 transition-colors">Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

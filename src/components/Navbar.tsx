"use client";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './logo';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold dark:text-white">
          <Logo />
        </Link>
        
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link href="/" className="hover:text-red-600">News</Link>
          <Link href="/jobs" className="hover:text-red-600">Jobs</Link>
          <Link href="/tenders" className="hover:text-red-600">Tenders</Link>
          <Link href="/advertise" className="text-green-600 hover:text-green-500">Advertise</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
          {user ? (
            <Link href="/admin" className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded text-sm font-medium">Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-medium dark:text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LanguageToggle } from "@/components/Toggles";
import { Wand2 } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold dark:text-white">
          Look<span className="text-red-600">Online</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-300">
          <Link href="/" className="hover:text-red-600 transition-colors">News</Link>
          <Link href="/jobs" className="hover:text-red-600 transition-colors">Jobs</Link>
          <Link href="/tenders" className="hover:text-red-600 transition-colors">Tenders</Link>
          <Link href="/resume" className="flex items-center gap-2 hover:text-red-600 transition-colors">
            <Wand2 className="h-4 w-4"/>
            Resume AI
          </Link>
          <Link href="/advertise" className="text-green-600 font-bold hover:text-green-500">Advertise</Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          {user ? (
            <Link href="/admin" className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded text-sm hover:opacity-90">Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:text-red-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

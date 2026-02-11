'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Menu, X, Newspaper, Briefcase, FileText } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/news', label: 'News', icon: <Newspaper className="h-4 w-4" /> },
  { href: '/jobs', label: 'Jobs', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/tenders', label: 'Tenders', icon: <FileText className="h-4 w-4" /> },
];

const regions = [
  { value: 'all', label: '🌍 Global' },
  { value: 'us', label: '🇺🇸 US' },
  { value: 'in', label: '🇮🇳 IN' },
  { value: 'gb', label: '🇬🇧 UK' },
];

function RegionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    const region = searchParams.get('region');
    if (region && regions.some((r) => r.value === region)) {
      setSelectedRegion(region);
    }
  }, [searchParams]);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const params = new URLSearchParams(searchParams.toString());
    if (region === 'all') {
      params.delete('region');
    } else {
      params.set('region', region);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={selectedRegion} onValueChange={handleRegionChange}>
      <SelectTrigger className="w-auto gap-2 border-0 bg-transparent shadow-none focus:ring-0">
        <SelectValue placeholder="Region" />
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
          <SelectItem key={region.value} value={region.value}>
            {region.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function HeaderContent() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-sm border-b'
          : 'bg-background/0'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname.startsWith(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <RegionSwitcher />
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <Logo />
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary',
                        pathname.startsWith(link.href)
                          ? 'text-primary'
                          : 'text-foreground'
                      )}
                    >
                      {link.icon} {link.label}
                    </Link>
                  ))}
                   <hr/>
                  <RegionSwitcher />
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderContent />
    </Suspense>
  )
}

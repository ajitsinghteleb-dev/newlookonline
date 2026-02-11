import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export function CategoryCard({ name, description, href, icon }: CategoryCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
          {icon}
          <div className="flex-grow">
            <CardTitle className="font-headline text-2xl">{name}</CardTitle>
          </div>
           <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-primary" />
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

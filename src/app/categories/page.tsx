import type { Metadata } from 'next';
import { Newspaper, Briefcase, FileText } from 'lucide-react';
import { CategoryCard } from '@/components/category-card';

export const metadata: Metadata = {
  title: 'Content Categories',
  description: 'Explore all content categories available on LookOnline Global, including news, jobs, and tenders.',
};

const categories = [
  {
    name: 'News',
    description: 'Stay updated with the latest headlines and stories from around the world.',
    href: '/news',
    icon: <Newspaper className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Jobs',
    description: 'Find your next career opportunity with our comprehensive job listings.',
    href: '/jobs',
    icon: <Briefcase className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Tenders',
    description: 'Discover new business opportunities with government and private tenders.',
    href: '/tenders',
    icon: <FileText className="h-10 w-10 text-primary" />,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter">
          Explore Our Content
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We aggregate the latest information across various sectors to keep you informed and ahead of the curve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            description={category.description}
            href={category.href}
            icon={category.icon}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ title, description, href, icon }: FeatureCardProps) {
  return (
    <Link to={href} className="group">
      <Card className="h-full border-none shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-card/50 dark:hover:bg-card">
        <CardHeader className="p-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed mt-2 text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
           <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              <span>Explore</span>
              <ArrowRight className="ml-1 h-3 w-3" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}

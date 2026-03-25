import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img src="/logo.png" alt="Annagrah Logo" className="h-[40px] w-auto object-contain" />
    </div>
  );
}

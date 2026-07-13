import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageToolbarProps {
  children: ReactNode;
  className?: string;
}

export function PageToolbar({ children, className }: PageToolbarProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-6 lg:px-8 bg-background/30", className)}>
      {children}
    </div>
  );
}

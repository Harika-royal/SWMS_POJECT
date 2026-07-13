import { ReactNode } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';

interface FilterPanelProps {
  children: ReactNode;
  triggerText?: string;
  activeCount?: number;
  className?: string;
}

export function FilterPanel({ children, triggerText = "Filters", activeCount = 0, className }: FilterPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <Filter className="h-4 w-4" />
          <span>{triggerText}</span>
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="font-medium text-sm">Filter Options</div>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}

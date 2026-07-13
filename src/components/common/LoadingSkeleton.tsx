import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  type?: 'card' | 'table' | 'list' | 'detail';
}

export function LoadingSkeleton({ className, type = 'card' }: LoadingSkeletonProps) {
  if (type === 'table') {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={cn("rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4", className)}>
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  );
}

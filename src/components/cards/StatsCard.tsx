import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </div>
        <div className="flex flex-col gap-1 pt-2">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {trend ? (
            <div className="flex items-center text-xs">
              <span className={cn(
                "font-medium mr-1",
                trend.isPositive === true ? "text-emerald-600 dark:text-emerald-400" : 
                trend.isPositive === false ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          ) : description ? (
            <div className="text-xs text-muted-foreground">{description}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

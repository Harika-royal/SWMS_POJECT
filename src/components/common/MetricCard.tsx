import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MetricCard({ title, value, trend, trendDirection = 'neutral', icon, className, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
  className={cn(
  "overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
  className
)}
>
     <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
<p className="text-base font-semibold text-slate-700 dark:text-slate-200">
  {title}
</p>
            {icon && <div className="h-5 w-5 text-slate-600 dark:text-slate-200">{icon}</div>}
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white"></h2>
            {trend && (
              <span className={cn(
                "text-sm font-medium",
                trendDirection === 'up' && "text-emerald-600 dark:text-emerald-400",
                trendDirection === 'down' && "text-red-600 dark:text-red-400",
                trendDirection === 'neutral' && "text-slate-600 dark:text-slate-300"
              )}>
                {trend}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

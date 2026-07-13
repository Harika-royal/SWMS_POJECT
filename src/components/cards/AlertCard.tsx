import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/utils/cn';

interface AlertCardProps {
  title: string;
  description?: string;
  type?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
}

export function AlertCard({ title, description, type = 'default', className }: AlertCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'destructive': return <XCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Alert 
      variant={type === 'destructive' ? 'destructive' : 'default'} 
      className={cn(
        type === 'success' && "border-emerald-500/50 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400",
        type === 'warning' && "border-amber-500/50 text-amber-600 dark:border-amber-500/30 dark:text-amber-400",
        className
      )}
    >
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}

import { cn } from '@/utils/cn';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'completed' | 'delivered' | 'in-stock' | 'success' | 
          'pending' | 'processing' | 'warning' | 'alert' |
          'cancelled' | 'error' | 'out-of-stock' | 'offline' |
          'shipped' | 'transit' | 'low-stock' | 'info' |
          'draft' | 'inactive';
  label?: string;
}

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const getVariantClasses = () => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'delivered':
      case 'in-stock':
      case 'success':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500';
      case 'pending':
      case 'processing':
      case 'warning':
      case 'alert':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500';
      case 'cancelled':
      case 'error':
      case 'out-of-stock':
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-red-300 dark:border-red-500';
      case 'shipped':
      case 'transit':
      case 'low-stock':
      case 'info':
       return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-300 dark:border-blue-500';
      case 'draft':
      case 'inactive':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-500';
    }
  };

  const displayLabel = label || status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <span
      className={cn(
'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap border shadow-sm transition-all duration-300 hover:scale-105',
        className
      )}
      {...props}
    >
      <>
  <span
    className={cn(
      "w-2 h-2 rounded-full",
      status === "active" ||
      status === "completed" ||
      status === "delivered" ||
      status === "in-stock" ||
      status === "success"
        ? "bg-emerald-500"
        : status === "pending" ||
          status === "processing" ||
          status === "warning" ||
          status === "alert"
        ? "bg-amber-500"
        : status === "cancelled" ||
          status === "error" ||
          status === "out-of-stock" ||
          status === "offline"
        ? "bg-red-500"
        : status === "shipped" ||
          status === "transit" ||
          status === "low-stock" ||
          status === "info"
        ? "bg-blue-500"
        : "bg-slate-500"
    )}
  />

  {displayLabel}
</>
    </span>
  );
}

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBox({ className, containerClassName, placeholder = "Search...", ...props }: SearchBoxProps) {
  return (
    <div className={cn("relative flex-1 max-w-md", containerClassName)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className={cn("pl-9 bg-background/50", className)}
        {...props}
      />
    </div>
  );
}

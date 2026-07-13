import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between px-2 py-4", className)}>
      <div className="text-sm text-muted-foreground">
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          {currentPage > 2 && (
            <>
              <Button variant="ghost" size="icon" onClick={() => onPageChange(1)}>1</Button>
              {currentPage > 3 && <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
            </>
          )}
          {currentPage > 1 && (
            <Button variant="ghost" size="icon" onClick={() => onPageChange(currentPage - 1)}>{currentPage - 1}</Button>
          )}
          <Button variant="secondary" size="icon" className="pointer-events-none">{currentPage}</Button>
          {currentPage < totalPages && (
            <Button variant="ghost" size="icon" onClick={() => onPageChange(currentPage + 1)}>{currentPage + 1}</Button>
          )}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
              <Button variant="ghost" size="icon" onClick={() => onPageChange(totalPages)}>{totalPages}</Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

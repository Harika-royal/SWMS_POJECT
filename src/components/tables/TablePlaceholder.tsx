import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

export function TablePlaceholder() {
  return (
    <div className="rounded-md border p-4 bg-card">
      <LoadingSkeleton type="table" />
    </div>
  );
}

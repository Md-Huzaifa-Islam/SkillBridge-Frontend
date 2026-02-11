export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function TutorCardSkeleton() {
  return (
    <div className="animate-pulse border rounded-lg p-6">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-muted rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

import { TutorCardSkeleton } from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <div className="h-10 bg-muted rounded w-1/3 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <TutorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

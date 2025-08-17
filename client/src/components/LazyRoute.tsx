import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyRouteProps {
  factory: () => Promise<{ default: ComponentType<any> }>;
}

const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <Skeleton className="h-4 w-24" />
    </div>
    
    <div className="text-center mb-8">
      <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
      <Skeleton className="h-8 w-48 mx-auto mb-4" />
      <Skeleton className="h-4 w-80 mx-auto" />
    </div>
    
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-12 w-32 mx-auto" />
    </div>
  </div>
);

export function LazyRoute({ factory }: LazyRouteProps) {
  const LazyComponent = lazy(factory);
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponent />
    </Suspense>
  );
}
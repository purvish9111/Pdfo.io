import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyRouteProps {
  factory: () => Promise<{ default: ComponentType<any> }>;
}

// Removed loading skeleton - instant page access
const LoadingSkeleton = () => null;

export function LazyRoute({ factory }: LazyRouteProps) {
  const LazyComponent = lazy(factory);
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponent />
    </Suspense>
  );
}
import { useMemo } from 'react';

export default function Skeleton({ className = '', lines = 1, width }) {
  const classes = useMemo(() => {
    const base = [
      'shimmer',
      'rounded-lg',
      'h-4',
      'w-full',
    ];
    if (width) base.push(width);
    return [...base, className].filter(Boolean).join(' ');
  }, [className, width]);

  if (lines === 1) {
    return <div className={classes} role="presentation" aria-hidden="true" />;
  }

  return (
    <div className="space-y-3" role="presentation" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={classes}
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-in" role="status" aria-label="Loading analysis">
      <div className="space-y-2">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="space-y-3">
        <Skeleton lines={4} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <div className="space-y-2">
        <Skeleton lines={3} />
      </div>
      <span className="sr-only">AI is analyzing your content. Please wait.</span>
    </div>
  );
}

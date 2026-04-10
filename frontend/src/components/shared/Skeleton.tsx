import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200/60 dark:bg-zinc-800/60", className)}
      {...props}
    />
  );
}

export function SkeletonCircle({ size = 12, className }: { size?: number, className?: string }) {
  return (
    <Skeleton 
      className={cn("rounded-full flex-shrink-0", className)} 
      style={{ width: `${size * 0.25}rem`, height: `${size * 0.25}rem` }} 
    />
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-full rounded-full", className)} />;
}

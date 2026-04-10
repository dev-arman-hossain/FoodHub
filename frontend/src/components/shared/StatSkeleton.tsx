import { Skeleton, SkeletonCircle, SkeletonLine } from "./Skeleton";

export function StatSkeleton() {
  return (
    <div className="p-10 bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-6">
      <Skeleton className="w-14 h-14 rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

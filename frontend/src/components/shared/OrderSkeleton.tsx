import { Skeleton, SkeletonCircle, SkeletonLine } from "./Skeleton";

export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/20 p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 space-y-6 border-r border-zinc-50 pr-8">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        </div>
        <div className="p-6 bg-zinc-50 rounded-3xl space-y-4">
          <SkeletonLine className="h-4 w-1/2" />
          <SkeletonLine className="h-4 w-3/4" />
        </div>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <Skeleton className="h-3 w-24 rounded-full" />
        <div className="space-y-4">
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-full" />
          <div className="pt-4 border-t border-zinc-50">
            <Skeleton className="h-8 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
        <Skeleton className="h-12 w-full rounded-3xl" />
        <Skeleton className="h-8 w-1/2 mx-auto rounded-full" />
      </div>
    </div>
  );
}

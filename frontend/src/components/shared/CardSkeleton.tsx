import { Skeleton, SkeletonCircle, SkeletonLine } from "./Skeleton";

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm h-full flex flex-col">
      {/* Aspect Ratio Image Placeholder */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      
      <div className="p-8 space-y-6 flex flex-col flex-grow">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <SkeletonLine className="h-8 w-3/4" />
          <div className="space-y-2">
            <SkeletonLine className="h-3 italic" />
            <SkeletonLine className="h-3 w-5/6" />
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonCircle size={10} />
            <div className="space-y-1">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-2 w-12 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-10 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

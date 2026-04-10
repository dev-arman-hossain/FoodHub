import { Skeleton } from "./Skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/20">
      <div className="bg-zinc-950 px-8 py-6">
        <Skeleton className="h-4 w-48 bg-white/20" />
      </div>
      <div className="divide-y divide-zinc-50">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-8 py-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-3 w-1/4 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

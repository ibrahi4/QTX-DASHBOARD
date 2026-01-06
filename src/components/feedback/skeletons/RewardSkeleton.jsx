import { Skeleton } from "@/components/ui/skeleton";

function RewardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-green-1/50 rounded-lg p-6 flex flex-col gap-2"
        >
          <Skeleton className={" bg-white/30  h-6 w-[100px]"} />
          <Skeleton className={" bg-white/30  h-6 w-[160px]"} />
          <Skeleton className={" bg-white/30  h-6 w-[140px]"} />
          <div className="flex items-center gap-3 mt-4">
            <Skeleton className={" bg-white/30  h-6 w-[100px] flex-1"} />
            <Skeleton className={" bg-white/30  h-6 w-[100px] flex-1"} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default RewardSkeleton;

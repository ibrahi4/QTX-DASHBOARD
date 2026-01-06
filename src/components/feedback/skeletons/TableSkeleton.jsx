import { Skeleton } from "@/components/ui/skeleton";


function TableSkeleton({ td, tr }) {
  const tableSkeleton = Array(td)
    .fill(0)
    .map((_, idx) => (
      <td key={idx}>
        <div className="px-4">
          <Skeleton className={"mx-auto bg-white/30 my-4 h-6 w-[100px]"} />
        </div>
      </td>
    ));
  return Array(tr)
    .fill(0)
    .map((_, idx) => (
      <tr key={idx} className="border-b">
        {tableSkeleton}
      </tr>
    ));
}

export default TableSkeleton;

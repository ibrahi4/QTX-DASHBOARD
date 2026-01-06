import { Spinner } from "@/components/shared/Spinner";

function AddNewAdminFormSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner className={"text-white"} />
    </div>
  );
}

export default AddNewAdminFormSkeleton;

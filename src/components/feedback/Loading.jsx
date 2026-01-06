import LottieHandler from "./lottieHandler/LottieHandler";
import AddNewAdminFormSkeleton from "./skeletons/AddNewAdminFormSkeleton";
import RewardSkeleton from "./skeletons/RewardSkeleton";
import TableSkeleton from "./skeletons/TableSkeleton";

const skeletonType = {
  table: TableSkeleton,
  AddNewAdminForm: AddNewAdminFormSkeleton,
  reward: RewardSkeleton,
};

export default function Loading({ status, error, children, type, tr, td }) {
  const Component = skeletonType[type];

  if (status === true) {
    return <Component td={td} tr={tr} />;
  } else if (status === false && error) {
    return (
      <>
        {type === "table" ? (
          <tr>
            <td colSpan={td}>
              <LottieHandler
                type="error"
                message={
                  typeof error === "string" ? error : "An unexpected error"
                }
              />
            </td>
          </tr>
        ) : (
          <div className="col-span-4">
            <LottieHandler
              type="error"
              message={
                typeof error === "string" ? error : "An unexpected error"
              }
            />
          </div>
        )}
      </>
    );
  } else if (status === false && !error) {
    return <>{children}</>;
  }

  return null;
}

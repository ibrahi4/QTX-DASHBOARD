/* eslint-disable react/prop-types */
import CustomerRating from "@/components/icons/cursomerRating";
import { setJourney } from "@/services/reducers/journey";
import { useTranslation } from "react-i18next";
import { IoCarOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

const JourneyCard = ({ i, j, valid, setFlyToPosition, markerRefs, data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <div
      key={i}
      className="rounded-[16px] cursor-pointer p-6 border my-5"
      onClick={() => {
        if (valid) {
          setFlyToPosition(data);
          markerRefs.current[`${j.id}-start`]?.openPopup();
          dispatch(setJourney(data));
        }
      }}
      style={{
        borderColor: j?.status == "canceled" ? "#EC373B" : "#3872FA",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="block">{j?.driver}</span>
          <span className="block">{"#" + i}</span>
        </div>
        <div className="flex items-center gap-2">
          <CustomerRating className="size-7" />
          {j?.rating}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 my-4">
        {valid ? (
          <>
            <span>{j?.starting_city}</span>
            <div className="flex items-center gap-1 ">
              <hr
                className={`border-b border-t-0 w-[40px] border-${
                  j.status == "canceled" ? "red" : "primary-1"
                }`}
              />
              <span
                className={`grid border  place-content-center size-8 rounded-sm`}
                style={{
                  backgroundColor:
                    j.status == "canceled" ? "#EC373B33" : "#007AFF1A",
                  borderColor: j.status == "canceled" ? "#EC373B" : "#3872FA",
                }}
              >
                <IoCarOutline
                  size={24}
                  className={`text-${
                    j?.status == "canceled" ? "red" : "primary-1"
                  }`}
                />
              </span>
              <hr
                className={`border-b  border-t-0 w-[40px] ${
                  j.status == "canceled"
                    ? "border-red"
                    : j.status == "completed"
                    ? "border-primary-1"
                    : "border-[#888] dark:border-gray-300"
                }`}
              />
            </div>
            <span>{j?.ending_city}</span>
          </>
        ) : (
          <span className="text-red">{t("inValidCoordinates")}</span>
        )}
      </div>
    </div>
  );
};

export default JourneyCard;

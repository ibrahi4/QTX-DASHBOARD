/* eslint-disable react/prop-types */
import TimerIcon from "@/components/icons/timerIcon";
import { useTranslation } from "react-i18next";
import { IoCarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const SeeDetails = ({ flyToPosition, setFlyToPosition }) => {
  const { t } = useTranslation();
  return (
    <section className="p-6  bg-white dark:bg-gray-800 rounded-[20px] absolute left-1/2 -translate-x-1/2 bottom-5  w-[70%] z-[2]">
      <span
        onClick={() => setFlyToPosition(null)}
        className="absolute cursor-pointer rtl:left-3 ltr:right-3 top-2"
      >
        x
      </span>
      <div className="flex items-center justify-between my-4">
        <span>{t("Itinerary")}</span>
        <Link
          to={`/journey-details/${flyToPosition.id}`}
          className="block px-4 py-1 text-white rounded-md bg-primary-1"
        >
          {t("ViewJourneyDetails")}
        </Link>
      </div>
      <section className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <span className="size-8 bg-[#007AFF1A] border border-primary-1 grid place-content-center">
              <TimerIcon />
            </span>
            <div>
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("departureAlt")}
              </p>
              <p className="font-medium text-[#888888] dark:text-gray-300">
                {flyToPosition.start}
              </p>
            </div>
          </div>
        </div>
        <div
          className="w-12 h-[2px]"
          style={{
            backgroundColor: flyToPosition.status == "canceled" ? "#EC373B" : "#3872fa",
          }}
        />
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <span
              className="size-8 bg-[#007AFF1A] border  grid place-content-center"
              style={{
                borderColor:
                  flyToPosition.status == "canceled"
                    ? "#EC373B"
                    : flyToPosition.status == "completed"
                    ? "#3872fa"
                    : "#EE9919",
              }}
            >
              <IoCarOutline
                size={24}
                color={
                  flyToPosition.status == "canceled"
                    ? "#EC373B"
                    : flyToPosition.status == "completed"
                    ? "#3872fa"
                    : "#EE9919"
                }
              />
            </span>
            <div>
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("dropOffAlt")}
              </p>
              <p className="font-medium text-[#888888] dark:text-gray-300">
                {flyToPosition.end}
              </p>
            </div>
          </div>
        </div>
        <span
          style={{
            color:
              flyToPosition.status == "canceled"
                ? "#EC373B"
                : flyToPosition.status == "completed"
                ? "#3872fa"
                : "#EE9919",
            backgroundColor:
              flyToPosition.status === "canceled"
                ? "rgba(236, 55, 59, 0.1)"
                : flyToPosition.status === "completed"
                ? "rgba(56, 114, 250, 0.1)"
                : "rgba(238, 153, 25, 0.1)",
          }}
          className="p-2 text-sm rounded-full"
        >
          {t(flyToPosition.status)}
        </span>
      </section>
    </section>
  );
};

export default SeeDetails;

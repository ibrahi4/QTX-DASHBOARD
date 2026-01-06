import DrivingIcon from "@/components/icons/drivingIcon";
import PassengerIcon from "@/components/icons/passengerIcon";
import StarSquareIcon from "@/components/icons/starSquareIcon";
import TimerIcon from "@/components/icons/timerIcon";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCarOutline } from "react-icons/io5";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useSelector } from "react-redux";
import driver from "../../../public/assets/driver.png";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";

const JourneyDetails = () => {
  const { t } = useTranslation();
  const { journey } = useSelector((state) => state.journey);
  const [openReason, setOpenReason] = useState(false);
  const [addDriver, setAddDriver] = useState(false);
  const data = [
    {
      id: 2,
      img: driver,
      name: "أحمد ياسر   ",
      journeyCost: "500رس",
      city: "السليمانية",
      kind: "تويوتا كامري ",
      journeys: 5,
      status: "متاح",
    },
    {
      id: 3,
      img: driver,
      name: "أحمد ياسر   ",
      journeyCost: "500رس",
      city: "السليمانية",
      kind: "تويوتا كامري ",
      journeys: 5,
      status: "متاح",
    },
    {
      id: 4,
      img: driver,
      name: "أحمد ياسر   ",
      journeyCost: "500رس",
      city: "السليمانية",
      kind: "تويوتا كامري ",
      journeys: 5,
      status: "متاح",
    },
    {
      id: 5,
      img: driver,
      name: "أحمد ياسر   ",
      journeyCost: "500رس",
      city: "السليمانية",
      kind: "تويوتا كامري ",
      journeys: 5,
      status: "متاح",
    },
    {
      id: 6,
      img: driver,
      name: "أحمد ياسر   ",
      journeyCost: "500رس",
      city: "السليمانية",
      kind: "تويوتا كامري ",
      journeys: 5,
      status: "متاح",
    },
  ];
  const headData = [
    t("drivers"),
    t("journeyCost"),
    t("city"),
    t("carType"),
    t("journeys"),
    t("driverStatus"),
  ];
  return (
    <main className="container space-y-5">
      <section className="p-4 mt-8 space-y-5 bg-white rounded-sm dark:bg-gray-900">
        <div className="grid lg:[grid-template-columns:1fr_2fr_1fr] grid-cols-1 gap-4 py-10  md:grid-cols-2 ">
          <div className="space-y-4">
            <p className="font-bold text-center text-[#717171] dark:text-gray-400">
              {t("journeyNumber")}
            </p>
            <p className="font-bold text-center text-[#888888] dark:text-gray-300">
              {journey.id}
            </p>
            <p
              style={{
                color:
                  journey.status == "canceled"
                    ? "#EC373B"
                    : journey.status == "completed"
                    ? "#3872fa"
                    : "#EE9919",
                backgroundColor:
                  journey.status === "canceled"
                    ? "rgba(236, 55, 59, 0.1)"
                    : journey.status === "completed"
                    ? "rgba(56, 114, 250, 0.1)"
                    : "rgba(238, 153, 25, 0.1)",
              }}
              className="p-2 mx-auto text-sm rounded-full w-fit"
            >
              {t(journey.status)}
            </p>
            {journey.status == "canceled" && (
              <p
                onClick={() => setOpenReason(true)}
                className="px-4 py-1 mx-auto border rounded-md cursor-pointer w-fit border-red text-red"
              >
                {t("cancelReason")}
              </p>
            )}
          </div>
          <div className="space-y-4 border-black md:border-l md:border-r dark:border-gray-500 lg:mx-10">
            {journey.status !== "notAttended" ? (
              <>
                <img
                  className="object-cover mx-auto rounded-full size-14 w-fit"
                  src="https://github.com/shadcn.png"
                  alt="profile"
                />
                <h2 className="font-medium text-center">{journey.driver}</h2>
                <p className="text-[#888888] font-medium text-center dark:text-gray-400">
                  0102547962
                </p>
                <span className="flex items-center gap-2 px-3 py-1 mx-auto text-sm text-center bg-transparent border rounded-lg border-primary-1 w-fit text-primary-1">
                  <DrivingIcon />
                  {t("driver")}
                </span>
              </>
            ) : (
              <>
                <span className="size-12 rounded-full  mx-auto bg-[#C6C6C633] grid place-content-center">
                  <PassengerIcon fill={"#8080808C"} />
                </span>
                <h2 className="font-medium text-center">{t("noDriverAssigned")}</h2>

                <Button
                  onClick={() => setAddDriver(true)}
                  className="!mx-auto text-white flex"
                >
                  <LuCircleFadingPlus />
                  {t("addDriver")}
                </Button>
              </>
            )}
          </div>
          <div className="space-y-4">
            <img
              className="object-cover mx-auto rounded-full size-14 w-fit"
              src="https://github.com/shadcn.png"
              alt="profile"
            />
            <h2 className="font-medium text-center">أحمد ياسر</h2>
            <p className="text-[#888888] font-medium text-center dark:text-gray-400">
              0102547962
            </p>
            <span className="flex items-center gap-2 px-3 py-1 mx-auto text-sm text-center bg-transparent border rounded-lg border-primary-1 w-fit text-primary-1">
              <PassengerIcon />
              {t("passenger")}
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-start gap-4 md:flex-nowrap">
        <div className="w-full p-4 space-y-5 bg-white rounded-sm dark:bg-gray-900">
          <h2 className="font-medium border-b border-[#88888866] py-2">
            {t("journeyInfo")}
          </h2>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <img src="/assets/car.png" className="size-[36px] w-14 object-cover" />
              <div>
                <h2 className="font-bold">تويوتا كامري</h2>
                <p className="font-medium text-[#888888] dark:text-gray-300">
                  254 عراس
                </p>
              </div>
            </div>
            <span className="text-lg font-medium text-green w-[130px]">500دع</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex-1">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("journeyType")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                ذهاب فقط
              </p>
            </div>
            <div className="w-[130px]">
              <p className="font-bold text-[#717171] dark:text-gray-400">{t("date")}</p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                11/9/2025
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex-1">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("payMethod")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">كاش</p>
            </div>
            <div className="w-[130px]">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("arrivalTime")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                8 مساءا
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex-1">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("distance")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                100متر
              </p>
            </div>
            <div className="w-[130px]">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("departureTime")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                4:00مساءا
              </p>
            </div>
          </div>
        </div>
        <div className="w-full p-4 bg-white rounded-sm dark:bg-gray-900">
          <h2 className="font-medium border-b  border-[#88888866] py-2">
            {t("Itinerary")}
          </h2>
          <div className="flex flex-wrap items-start justify-between gap-4 mt-5">
            <div className="flex items-start gap-4">
              <div>
                <span className="size-8 bg-[#007AFF1A] border border-primary-1 grid place-content-center">
                  <TimerIcon />
                </span>
                <div
                  className="h-12 w-[2px] mx-auto"
                  style={{
                    backgroundColor:
                      journey.status == "canceled"
                        ? "#EC373B"
                        : journey.status == "completed"
                        ? "#3872fa"
                        : "#EE9919",
                  }}
                />
              </div>
              <div>
                <p className="font-bold text-[#717171] dark:text-gray-400">
                  {t("departureAlt")}
                </p>
                <p className="font-medium text-[#888888] dark:text-gray-300">
                  {journey.start}
                </p>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#717171] dark:text-gray-400">مكتمله </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                4:00مساءا
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-start gap-4">
                <div>
                  <span
                    className="size-8 bg-[#007AFF1A] border  grid place-content-center"
                    style={{
                      borderColor:
                        journey.status == "canceled"
                          ? "#EC373B"
                          : journey.status == "completed"
                          ? "#3872fa"
                          : "#EE9919",
                    }}
                  >
                    <IoCarOutline
                      size={24}
                      color={
                        journey.status == "canceled"
                          ? "#EC373B"
                          : journey.status == "completed"
                          ? "#3872fa"
                          : "#EE9919"
                      }
                    />
                  </span>
                </div>
                <div>
                  <p className="font-bold text-[#717171] dark:text-gray-400">
                    {t("dropOffAlt")}
                  </p>
                  <p className="font-medium text-[#888888] dark:text-gray-300">
                    {journey.end}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <span
                style={{
                  color:
                    journey.status == "canceled"
                      ? "#EC373B"
                      : journey.status == "completed"
                      ? "#3872fa"
                      : "#EE9919",
                  backgroundColor:
                    journey.status === "canceled"
                      ? "rgba(236, 55, 59, 0.1)"
                      : journey.status === "completed"
                      ? "rgba(56, 114, 250, 0.1)"
                      : "rgba(238, 153, 25, 0.1)",
                }}
                className="p-1 text-xs rounded-[5px] block text-center"
              >
                {t(journey.status)}
              </span>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                4:00مساءا
              </p>
            </div>
          </div>
        </div>
        <div className="w-full p-4 space-y-5 bg-white rounded-sm dark:bg-gray-900">
          <div className="font-medium flex items-center justify-between border-b border-[#88888866] py-2">
            {t("rating")}
            <StarSquareIcon />
          </div>
          <div className="grid w-full h-full place-content-center">
            {journey.status == "completed" ? "4.5" : t("noRatingsYet")}
          </div>
        </div>
      </section>
      <ResponsiveDialog open={openReason} setOpen={setOpenReason}>
        <div className="min-h-[200px] flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl font-medium text-center">{t("cancelReason")}</h1>
          <p className="text-2xl text-center">
            حدثت حاله طائه للسائق وتم التعامل معها عن طريق الاداره
          </p>
        </div>
      </ResponsiveDialog>
      <ResponsiveDialog open={addDriver} setOpen={setAddDriver}>
        <div className="mt-8">
          <div>
            <ArabicTable headData={headData}>
              <Loading type="table" status={false} td={headData.length} tr={8}>
                {data?.length > 0 ? (
                  <>
                    {data.map((item) => (
                      <TableRow
                        key={item.id}
                        className="text-center border-t hover:dark:bg-gray-800"
                      >
                        <TableCell className="flex items-center justify-center gap-2 font-medium ">
                          <img src={item.img} alt="" className="w-8 h-8 rounded-full" />
                          {item.name}
                        </TableCell>
                        <TableCell className="text-primary-1">
                          {item.journeyCost}
                        </TableCell>
                        <TableCell>{item.city}</TableCell>
                        <TableCell>{item.kind}</TableCell>
                        <TableCell>{item.journeys}</TableCell>
                        <TableCell>
                          <div className="bg-[#E6F4EF] w-fit mx-auto px-1 text-[#11A849] py-2 rounded-md">
                            {item.status}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={headData.length}>
                      <LottieHandler type="empty" message={t("noData")} />
                    </TableCell>
                  </TableRow>
                )}
              </Loading>
            </ArabicTable>
          </div>
        </div>
      </ResponsiveDialog>
    </main>
  );
};

export default JourneyDetails;

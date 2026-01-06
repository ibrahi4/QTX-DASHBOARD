/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // لجلب الـ ID من الـ URL
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { IoCarOutline } from "react-icons/io5";
import DrivingIcon from "@/components/icons/drivingIcon";
import PassengerIcon from "@/components/icons/passengerIcon";
import StarSquareIcon from "@/components/icons/starSquareIcon";
import TimerIcon from "@/components/icons/timerIcon";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { toast } from "react-hot-toast";
import {
  getJourneyById,
  getAvailableDrivers,
  assignDriverToJourney,
} from "@/services/adminService";

const JourneyDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // جلب الـ ID من الـ URL

  const [journey, setJourney] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loadingJourney, setLoadingJourney] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [error, setError] = useState(null);

  const [openReason, setOpenReason] = useState(false);
  const [addDriver, setAddDriver] = useState(false);

  // جلب تفاصيل الرحلة الحقيقية حسب الـ ID
  useEffect(() => {
    const fetchJourney = async () => {
      if (!id) return;

      try {
        setLoadingJourney(true);
        setError(null);

        const res = await getJourneyById(id); // /admin/rides/:id أو /admin/journeys/:id
        const rideData = res.data || {};

        const mappedJourney = {
          id: rideData._id || id,
          status: rideData.status || "pending",
          driver: rideData.driver?.fullName || null,
          driverPhone: rideData.driver?.phone || "-",
          driverImg:
            rideData.driver?.profileImg || "https://github.com/shadcn.png",
          passengerName: rideData.passenger?.fullName || "أحمد ياسر",
          passengerPhone: rideData.passenger?.phone || "0102547962",
          passengerImg:
            rideData.passenger?.profileImg || "https://github.com/shadcn.png",
          start: rideData.pickupLocation?.city || rideData.fromCity || "-",
          end: rideData.dropoffLocation?.city || rideData.toCity || "-",
          fare: rideData.fare || 0,
          vehicleType: rideData.vehicle?.model || "تويوتا كامري",
          plateNumber: rideData.vehicle?.plateNumber || "254 عراس",
          tripType:
            rideData.tripType === "roundTrip" ? t("roundTrip") : t("oneWay"),
          departureDate: rideData.departureDate || rideData.createdAt,
          departureTime: rideData.departureTime,
          paymentMethod: rideData.paymentMethod || "كاش",
          distance: rideData.distance || "100 متر",
          rating: rideData.rating || null,
          cancelReason:
            rideData.cancelReason ||
            "حدثت حالة طارئة للسائق وتم التعامل معها عن طريق الإدارة",
        };

        setJourney(mappedJourney);
      } catch (err) {
        console.error("Failed to fetch journey details:", err);
        setError(t("failedToLoadJourney") || "Failed to load journey details");
        toast.error(
          t("failedToLoadJourney") || "Failed to load journey details"
        );
      } finally {
        setLoadingJourney(false);
      }
    };

    fetchJourney();
  }, [id, t]);

  // جلب السائقين المتاحين عند فتح المودال
  const handleOpenAddDriver = async () => {
    try {
      setLoadingDrivers(true);
      const res = await getAvailableDrivers(); // endpoint للسائقين المتاحين
      const drivers = res.data || [];

      const mappedDrivers = drivers.map((d) => ({
        id: d._id,
        img: d.profileImg || "/assets/driver.png",
        name: d.fullName || "سائق غير معروف",
        journeyCost: `${d.farePreference || 500} ر.س`,
        city: d.currentCity || "السليمانية",
        kind: d.vehicle?.model || "تويوتا كامري",
        journeys: d.completedTrips || 0,
        status: d.isAvailable ? t("available") : t("busy"),
      }));

      setAvailableDrivers(mappedDrivers);
      setAddDriver(true);
    } catch (err) {
      toast.error(
        t("failedToLoadDrivers") || "Failed to load available drivers"
      );
      setAvailableDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  // تعيين سائق للرحلة
  const handleAssignDriver = async (driverId) => {
    try {
      await assignDriverToJourney(id, driverId); // PATCH /admin/rides/:id/assign-driver
      toast.success(t("driverAssigned") || "Driver assigned successfully");

      // تحديث الرحلة بعد التعيين
      const res = await getJourneyById(id);
      const updated = res.data || {};
      setJourney((prev) => ({
        ...prev,
        driver: updated.driver?.fullName || prev.driver,
        driverPhone: updated.driver?.phone || prev.driverPhone,
        driverImg: updated.driver?.profileImg || prev.driverImg,
        status: "inProgress", // افتراضي بعد التعيين
      }));

      setAddDriver(false);
    } catch (err) {
      toast.error(t("assignFailed") || "Failed to assign driver");
    }
  };

  const headData = [
    t("drivers"),
    t("journeyCost"),
    t("city"),
    t("carType"),
    t("journeys"),
    t("driverStatus"),
  ];

  if (loadingJourney) {
    return (
      <main className="container py-20">
        <Loading type="spinner" />
      </main>
    );
  }

  if (error || !journey) {
    return (
      <main className="container py-20 text-center">
        <LottieHandler type="error" message={error || t("noJourneyFound")} />
      </main>
    );
  }

  return (
    <main className="container space-y-5">
      <section className="p-4 mt-8 space-y-5 bg-white rounded-sm dark:bg-gray-900">
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 py-10 md:grid-cols-2">
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
                  journey.status === "cancelled"
                    ? "#EC373B"
                    : journey.status === "completed"
                    ? "#3872fa"
                    : "#EE9919",
                backgroundColor:
                  journey.status === "cancelled"
                    ? "rgba(236, 55, 59, 0.1)"
                    : journey.status === "completed"
                    ? "rgba(56, 114, 250, 0.1)"
                    : "rgba(238, 153, 25, 0.1)",
              }}
              className="p-2 mx-auto text-sm rounded-full w-fit"
            >
              {t(journey.status)}
            </p>
            {journey.status === "cancelled" && (
              <p
                onClick={() => setOpenReason(true)}
                className="px-4 py-1 mx-auto border rounded-md cursor-pointer w-fit border-red text-red"
              >
                {t("cancelReason")}
              </p>
            )}
          </div>

          <div className="space-y-4 border-black md:border-l md:border-r dark:border-gray-500 lg:mx-10">
            {journey.status !== "notAttended" && journey.driver ? (
              <>
                <img
                  className="object-cover mx-auto rounded-full size-14 w-fit"
                  src={journey.driverImg}
                  alt="driver"
                />
                <h2 className="font-medium text-center">{journey.driver}</h2>
                <p className="text-[#888888] font-medium text-center dark:text-gray-400">
                  {journey.driverPhone}
                </p>
                <span className="flex items-center gap-2 px-3 py-1 mx-auto text-sm text-center bg-transparent border rounded-lg border-primary-1 w-fit text-primary-1">
                  <DrivingIcon />
                  {t("driver")}
                </span>
              </>
            ) : (
              <>
                <span className="size-12 rounded-full mx-auto bg-[#C6C6C633] grid place-content-center">
                  <PassengerIcon fill={"#8080808C"} />
                </span>
                <h2 className="font-medium text-center">
                  {t("noDriverAssigned")}
                </h2>
                <Button
                  onClick={handleOpenAddDriver}
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
              src={journey.passengerImg}
              alt="passenger"
            />
            <h2 className="font-medium text-center">{journey.passengerName}</h2>
            <p className="text-[#888888] font-medium text-center dark:text-gray-400">
              {journey.passengerPhone}
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
              <img
                src="/assets/car.png"
                className="size-[36px] w-14 object-cover"
                alt="car"
              />
              <div>
                <h2 className="font-bold">{journey.vehicleType}</h2>
                <p className="font-medium text-[#888888] dark:text-gray-300">
                  {journey.plateNumber}
                </p>
              </div>
            </div>
            <span className="text-lg font-medium text-green w-[130px]">
              {journey.fare} ر.س
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex-1">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("journeyType")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.tripType}
              </p>
            </div>
            <div className="w-[130px]">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("date")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.departureDate
                  ? new Date(journey.departureDate).toLocaleDateString("ar-EG")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex-1">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("payMethod")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.paymentMethod}
              </p>
            </div>
            <div className="w-[130px]">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("arrivalTime")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.departureTime
                  ? new Date(journey.departureTime).toLocaleTimeString(
                      "ar-EG",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
            <div className="flex-1">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("distance")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.distance}
              </p>
            </div>
            <div className="w-[130px]">
              <p className="font-bold text-[#717171] dark:text-gray-400">
                {t("departureTime")}
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.departureTime
                  ? new Date(journey.departureTime).toLocaleTimeString(
                      "ar-EG",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full p-4 bg-white rounded-sm dark:bg-gray-900">
          <h2 className="font-medium border-b border-[#88888866] py-2">
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
                      journey.status === "cancelled"
                        ? "#EC373B"
                        : journey.status === "completed"
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
              <p className="font-bold text-[#717171] dark:text-gray-400">
                مكتملة
              </p>
              <p className="font-medium text-[#888] dark:text-gray-300 text-sm">
                {journey.departureTime
                  ? new Date(journey.departureTime).toLocaleTimeString(
                      "ar-EG",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div>
                <span
                  className="size-8 bg-[#007AFF1A] border grid place-content-center"
                  style={{
                    borderColor:
                      journey.status === "cancelled"
                        ? "#EC373B"
                        : journey.status === "completed"
                        ? "#3872fa"
                        : "#EE9919",
                  }}
                >
                  <IoCarOutline
                    size={24}
                    color={
                      journey.status === "cancelled"
                        ? "#EC373B"
                        : journey.status === "completed"
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
            <div>
              <span
                style={{
                  color:
                    journey.status === "cancelled"
                      ? "#EC373B"
                      : journey.status === "completed"
                      ? "#3872fa"
                      : "#EE9919",
                  backgroundColor:
                    journey.status === "cancelled"
                      ? "rgba(236, 55, 59, 0.1)"
                      : journey.status === "completed"
                      ? "rgba(56, 114, 250, 0.1)"
                      : "rgba(238, 153, 25, 0.1)",
                }}
                className="p-1 text-xs rounded-[5px] block text-center"
              >
                {t(journey.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full p-4 space-y-5 bg-white rounded-sm dark:bg-gray-900">
          <div className="font-medium flex items-center justify-between border-b border-[#88888866] py-2">
            {t("rating")}
            <StarSquareIcon />
          </div>
          <div className="grid w-full h-full place-content-center text-4xl font-bold text-primary-1">
            {journey.rating ? journey.rating : t("noRatingsYet")}
          </div>
        </div>
      </section>

      {/* سبب الإلغاء */}
      <ResponsiveDialog open={openReason} setOpen={setOpenReason}>
        <div className="min-h-[200px] flex flex-col gap-4 items-center justify-center p-10">
          <h1 className="text-2xl font-medium text-center">
            {t("cancelReason")}
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300">
            {journey.cancelReason || t("noReasonProvided")}
          </p>
        </div>
      </ResponsiveDialog>

      {/* إضافة سائق */}
      <ResponsiveDialog open={addDriver} setOpen={setAddDriver}>
        <div className="p-6">
          <h2 className="text-xl font-medium text-center mb-6">
            {t("availableDrivers")}
          </h2>

          <ArabicTable headData={headData}>
            {loadingDrivers ? (
              <Loading type="table" status={true} td={headData.length} tr={5} />
            ) : availableDrivers.length > 0 ? (
              availableDrivers.map((driver) => (
                <TableRow
                  key={driver.id}
                  className="text-center border-t hover:dark:bg-gray-800 cursor-pointer"
                  onClick={() => handleAssignDriver(driver.id)}
                >
                  <TableCell className="flex items-center justify-center gap-2 font-medium">
                    <img
                      src={driver.img}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    {driver.name}
                  </TableCell>
                  <TableCell className="text-primary-1">
                    {driver.journeyCost}
                  </TableCell>
                  <TableCell>{driver.city}</TableCell>
                  <TableCell>{driver.kind}</TableCell>
                  <TableCell>{driver.journeys}</TableCell>
                  <TableCell>
                    <div className="bg-[#E6F4EF] w-fit mx-auto px-3 py-1 text-[#11A849] rounded-md">
                      {driver.status}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headData.length}>
                  <LottieHandler
                    type="empty"
                    message={t("noAvailableDrivers")}
                  />
                </TableCell>
              </TableRow>
            )}
          </ArabicTable>
        </div>
      </ResponsiveDialog>
    </main>
  );
};

export default JourneyDetails;

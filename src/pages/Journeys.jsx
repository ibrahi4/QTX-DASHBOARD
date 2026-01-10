import { useState, useEffect } from "react";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { LuCircleFadingPlus } from "react-icons/lu";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/components/hooks/useDebounce";
import { CiSearch } from "react-icons/ci";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import DateInput from "@/components/ui/dateInput";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import CardsJourney from "@/components/shared/Journeys/CardsJourney";
import { getAllRides, createRide } from "@/services/adminService";

const Journeys = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearch] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const { t } = useTranslation();

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        const res = await getAllRides();
        const ridesData = res.data?.rides || res.data || res || [];

        const mappedJourneys = ridesData.map((ride) => ({
          id: ride._id || ride.id,
          img: ride.driver?.profileImg || "/assets/driver.png",
          name: ride.driver?.fullName || t("notSpecified"),
          go: ride.departure || t("notSpecified"),
          arrive:
            ride.dropoffLocation?.address || ride.toCity || t("notSpecified"),
          cost: ride.fare ? `${ride.fare} SAR` : "-",
          status: ride.status || "pending",
          sort: ride.vehicleType === "roundTrip" ? t("roundTrip") : t("oneWay"),
          goTime: ride.departureTime
            ? new Date(ride.departureTime).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
          datet: ride.createdAt
            ? new Date(ride.createdAt).toLocaleDateString("ar-EG")
            : "-",
        }));

        setJourneys(mappedJourneys);
      } catch (err) {
        console.error("Error fetching journeys:", err);
        setError(t("failedToLoadJourneys") || "Failed to load journeys");
        toast.error(t("failedToLoadJourneys") || "Failed to load journeys");
        setJourneys([]); // لا نستخدم أي بيانات استاتيكية
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [t]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        fromCity: data.type_1,
        toCity: data.type_2,
        fromGarage: data.type_3,
        toGarage: data.type_4,
        departureTime: data.time,
        departureDate: data.date,
        tripType: data.journeyType,
        fare: Number(data.cost),
      };

      await createRide(payload);

      toast.success(t("journeyAdded") || "Journey added successfully");
      setOpenModal(false);
      reset();

      // تحديث القائمة بعد الإضافة
      const res = await getAllRides();
      const ridesData = res.data?.rides || res.data || [];

      const mapped = ridesData.map((ride) => ({
        id: ride._id || ride.id,
        img: ride.driver?.profileImg || "/assets/driver.png",
        name: ride.driver?.fullName || t("notSpecified"),
        go: ride.departure || t("notSpecified"),
        arrive: ride.dropoffLocation?.name || ride.toCity || t("notSpecified"),
        cost: ride.fare ? `${ride.fare} ر.س` : "-",
        status: ride.status || "pending",
        sort: ride.vehicleType === "roundTrip" ? t("roundTrip") : t("oneWay"),
        goTime: ride.startedAt
          ? new Date(ride.startedAt).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        datet: ride.createdAt
          ? new Date(ride.createdAt).toLocaleDateString("ar-EG")
          : "-",
      }));
      setJourneys(mapped);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error(t("addFailed") || "Failed to add journey");
    }
  };

  const headData = [
    t("drivers"),
    t("departure"),
    t("dropoff"),
    t("journeyCost"),
    t("journeyStatus"),
    t("journeyType"),
    t("departureTime"),
    t("startDate"),
  ];

  const filteredJourneys = journeys.filter(
    (j) =>
      j.name?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      j.go?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
      j.arrive?.toLowerCase().includes(debouncedValue.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div>
        <CardsJourney />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
          <h1 className="text-2xl font-medium dark:text-blue-300">
            {t("totalJourneys")}
          </h1>
        </div>
      </div>

      <div className="p-4 mt-8 bg-white rounded-[20px] dark:bg-gray-900">
        <div className="flex flex-wrap items-center border-b border-[#888888] py-4 justify-between flex-1 gap-4">
          <div>
            <h2 className="font-semibold">{t("latestJourneys")}</h2>
          </div>

          <div className="relative flex items-center mx-auto min-w-[300px]">
            <Input
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="px-[30px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
              placeholder={t("searchByNamePhoneEmail")}
            />
            <CiSearch
              size={22}
              className="absolute ltr:left-2 rtl:right-2 text-[#888888] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Select>
              <SelectTrigger className="w-[100px] dark:text-white">
                <SelectValue placeholder={t("journeyStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">completed</SelectItem>
                <SelectItem value="canceled">canceled</SelectItem>
              </SelectContent>
            </Select>

            <Controller
              name="join"
              control={control}
              render={({ field }) => (
                <FormItem className="relative w-[150px] text-black">
                  <DateInput
                    value={field.value || null}
                    onChange={field.onChange}
                    placeholder={t("date")}
                  />
                </FormItem>
              )}
            />

            <Select>
              <SelectTrigger className="w-[100px] dark:text-white">
                <SelectValue placeholder={t("downloadFile")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <ArabicTable headData={headData}>
            {loading ? (
              <Loading type="table" status={true} td={headData.length} tr={8} />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={headData.length}
                  className="text-center text-red-500 py-10"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredJourneys.length > 0 ? (
              filteredJourneys.map((item) => (
                <TableRow
                  key={item.id}
                  className="text-center border-t hover:dark:bg-gray-800"
                >
                  <TableCell className="flex items-center justify-center gap-2 font-medium">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {item.name}
                  </TableCell>
                  <TableCell>{item.go}</TableCell>
                  <TableCell>{item.arrive}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>
                    <div
                      className={`text-center px-2 py-2 font-semibold text-sm rounded-lg w-fit mx-auto ${
                        item.status === "completed"
                          ? "text-green bg-[#E6F4EF]"
                          : item.status === "cancelled"
                          ? "text-red bg-red-100"
                          : "text-yellow-800 bg-yellow-100"
                      }`}
                    >
                      {item.status === "completed"
                        ? t("completed")
                        : item.status === "cancelled"
                        ? t("cancelled")
                        : t("inProgress")}
                    </div>
                  </TableCell>
                  <TableCell>{item.sort}</TableCell>
                  <TableCell>{item.goTime}</TableCell>
                  <TableCell>{item.datet}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headData.length}>
                  <LottieHandler type="empty" message={t("noData")} />
                </TableCell>
              </TableRow>
            )}
          </ArabicTable>
        </div>
      </div>

      {/* Modal إضافة رحلة جديدة */}
      <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
        <div className="p-10">
          <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
            {t("addNewJourney")}
          </h2>

          <Form>
            <form
              dir="rtl"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <Controller
                  name="type_1"
                  control={control}
                  rules={{ required: t("departureCityRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("departureCity")}
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="no-focus dark:bg-gray-800 dark:text-white min-h-[56px] bg-[#F9F9F9] text-black">
                          <SelectValue placeholder={t("selectCity")} />
                        </SelectTrigger>
                      </Select>
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.type_1?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="type_2"
                  control={control}
                  rules={{ required: t("destinationCityRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("destinationCity")}
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="no-focus dark:bg-gray-800 dark:text-white min-h-[56px] bg-[#F9F9F9] text-black">
                          <SelectValue placeholder={t("selectCity")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baghdad">بغداد</SelectItem>
                          <SelectItem value="duhok">دهوك</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.type_2?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <Controller
                  name="type_3"
                  control={control}
                  rules={{ required: t("departureGarageRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("departureGarage")}
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="no-focus dark:bg-gray-800 dark:text-white min-h-[56px] bg-[#F9F9F9] text-black">
                          <SelectValue placeholder={t("selectGarage")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="garage1">كراج 1</SelectItem>
                          <SelectItem value="garage2">كراج 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.type_3?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="type_4"
                  control={control}
                  rules={{ required: t("destinationGarageRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("arrivalGarage")}
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="no-focus dark:bg-gray-800 dark:text-white min-h-[56px] bg-[#F9F9F9] text-black">
                          <SelectValue placeholder={t("selectGarage")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="garage1">كراج 1</SelectItem>
                          <SelectItem value="garage2">كراج 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.type_4?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: t("timeRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("time")}
                      </label>
                      <Input
                        {...field}
                        type="time"
                        className="min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.time?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="date"
                  control={control}
                  rules={{ required: t("dateRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("date")}
                      </label>
                      <DateInput
                        noIcons
                        value={field.value || null}
                        onChange={field.onChange}
                        triggerClassName="min-h-[56px] dark:!bg-gray-800 dark:text-white !bg-[#F9F9F9]"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.date?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <Controller
                  name="journeyType"
                  control={control}
                  rules={{ required: t("journeyTypeRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("journeyType")}
                      </label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="no-focus dark:bg-gray-800 dark:text-white min-h-[56px] bg-[#F9F9F9] text-black">
                          <SelectValue placeholder={t("selectJourneyType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oneWay">{t("oneWay")}</SelectItem>
                          <SelectItem value="roundTrip">
                            {t("roundTrip")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.journeyType?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="cost"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("journeyCost")}
                      </label>
                      <Input
                        {...field}
                        type="number"
                        className="no-focus dark:bg-gray-800 dark:text-white min-h-[56px] bg-[#F9F9F9] text-black"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.cost?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-center gap-6 pb-10">
                <Button type="submit" className="w-[200px]">
                  {t("add")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    reset();
                  }}
                  className="bg-red hover:bg-red w-[200px]"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default Journeys;

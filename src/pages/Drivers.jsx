import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrivers } from "@/Features/Drivers/driversSlice";
import { createDriver } from "@/services/adminService"; // تأكد من إنشاء هذه الدالة
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { LuCircleFadingPlus } from "react-icons/lu";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import driverPlaceholder from "../../public/assets/driver.png";
import { BiSolidEdit } from "react-icons/bi";
import { HiMiniTrash } from "react-icons/hi2";
import feadback from "../../public/assets/Feedback Icon.png";
import DateInput from "@/components/ui/dateInput";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

const Drivers = () => {
  const dispatch = useDispatch();
  const { drivers, loading, error } = useSelector((state) => state.drivers);

  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const headData = [
    t("drivers"),
    t("city"),
    t("carType"),
    t("carNumber"),
    t("driverDocs"),
    t("carDocs"),
    t("driverStatus"),
    t("joinDate"),
    t("actions"),
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      carType: "",
      carNumber: "",
      joinDate: null,
      city: "",
      phone: "",
    },
  });

  // دالة الإضافة الحقيقية مع معالجة الأخطاء والتحديث
  const onSubmit = async (data) => {
    try {
      console.log("Submitting new driver:", data);

      // تحويل البيانات للشكل اللي الـ backend يتوقعه
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        carType: data.carType,
        carNumber: data.carNumber,
        // joinDate لو الباك يدعمه، ممكن نضيفه
      };

      // استدعاء الـ API الحقيقي
      await createDriver(payload);

      toast.success(t("driverAdded") || "Driver added successfully!");

      // إغلاق المودال وتفريغ الفورم
      setOpenModal(false);
      reset();

      // تحديث القائمة فورًا من الـ backend
      dispatch(fetchDrivers());
    } catch (err) {
      console.error("Error adding driver:", err);
      toast.error(t("addFailed") || "Failed to add driver. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  return (
    <div className="container py-8">
      <div className="mt-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-[#222222] dark:text-white">
            {t("drivers")}
          </h1>
          <Button
            onClick={() => setOpenModal(true)}
            className="flex min-h-[40px] items-center gap-2 text-white"
          >
            <LuCircleFadingPlus />
            <span>{t("addDriver")}</span>
          </Button>
        </div>

        <div className="p-4 mt-8 bg-white rounded-sm dark:bg-gray-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-[#111111] font-medium dark:text-white">
              {t("driversList")}
            </div>

            <div className="relative">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                placeholder={t("searchForJourney")}
                className="px-10 min-h-[40px] rounded-full bg-[#F9F9F9] dark:bg-gray-800 border-none focus:ring-1 focus:ring-primary-1"
              />
              <CiSearch
                size={20}
                className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-[#888888] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={t("city")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cairo">Cairo</SelectItem>
                  <SelectItem value="alex">Alexandria</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={t("carType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder={t("journeyType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>

              <Controller
                name="join"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <FormItem>
                    <DateInput
                      value={field.value || null}
                      onChange={field.onChange}
                      placeholder={t("joinDate")}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8">
            <ArabicTable headData={headData}>
              {loading ? (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`} className="animate-pulse">
                      {Array.from({ length: headData.length }).map((_, j) => (
                        <TableCell key={`cell-${j}`}>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={headData.length}
                    className="text-center text-red-500 py-10"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : drivers.length > 0 ? (
                <>
                  {drivers.map((item) => (
                    <TableRow
                      key={item._id}
                      className="text-center border-t hover:dark:bg-gray-800"
                    >
                      <TableCell className="flex items-center justify-center gap-3 font-medium">
                        <img
                          src={item.profileImg || driverPlaceholder}
                          alt={item.fullName || "Driver"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{item.fullName || "Not specified"}</span>
                      </TableCell>
                      <TableCell>{item.city || "-"}</TableCell>
                      <TableCell>
                        {item.vehicleType || item.vehicleType || "-"}
                      </TableCell>
                      <TableCell>
                        {item.vehiclePlateNumber ||
                          item.vehiclePlateNumber ||
                          "-"}
                      </TableCell>
                      {console.log(item.vehicleType)}
                      <TableCell>
                        <img
                          src={feadback}
                          alt="doc"
                          className="w-5 h-5 inline-block mx-auto"
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={feadback}
                          alt="doc"
                          className="w-5 h-5 inline-block mx-auto"
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className={`w-fit mx-auto px-4 py-1.5 rounded-md text-sm font-medium ${
                            item.status === "accepted"
                              ? "bg-[#E6F4EF] text-[#11A849]"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status === "accepted"
                            ? t("accepted") || "Accepted"
                            : item.status === "pending"
                            ? t("pending") || "Pending"
                            : t("rejected") || "Rejected"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <Link
                            to={`/users/drivers/${item._id}`}
                            className="bg-[#EEEFFC] rounded-md p-1.5 hover:bg-[#d0d0ff] transition"
                          >
                            <BiSolidEdit className="w-5 h-5 text-primary-1" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-[#FCE8E6] rounded-md p-1.5 hover:bg-[#f8d0ce]"
                          >
                            <HiMiniTrash className="w-5 h-5 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headData.length}
                    className="text-center py-16"
                  >
                    <LottieHandler type="empty" message={t("noData")} />
                  </TableCell>
                </TableRow>
              )}
            </ArabicTable>
          </div>
        </div>

        {/* Modal إضافة سائق جديد */}
        <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
          <div className="p-10">
            <h2 className="mb-6 text-2xl font-medium text-center">
              {t("addDriver")}
            </h2>

            <Form>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="fullName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: t("contentRequired") || "Full name is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("name")}
                        </label>
                        <Input
                          {...field}
                          placeholder="Full Name"
                          className="min-h-[56px] bg-[#F9F9F9] dark:bg-gray-800"
                        />
                        {errors.fullName && (
                          <span className="text-sm text-red-500 mt-1 block">
                            {errors.fullName.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />

                  <Controller
                    name="carType"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: t("contentRequired") || "Car type is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("carType")}
                        </label>
                        <Input
                          {...field}
                          placeholder="e.g. Toyota Camry"
                          className="min-h-[56px] bg-[#F9F9F9] dark:bg-gray-800"
                        />
                        {errors.carType && (
                          <span className="text-sm text-red-500 mt-1 block">
                            {errors.carType.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="carNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required:
                        t("contentRequired") || "Car number is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("carNumber")}
                        </label>
                        <Input
                          {...field}
                          placeholder="e.g. ABC 1234"
                          className="min-h-[56px] bg-[#F9F9F9] dark:bg-gray-800"
                        />
                        {errors.carNumber && (
                          <span className="text-sm text-red-500 mt-1 block">
                            {errors.carNumber.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />

                  <Controller
                    name="joinDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <FormItem>
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("joinDate")}
                        </label>
                        <DateInput
                          value={field.value || null}
                          onChange={field.onChange}
                          triggerClassName="min-h-[56px] dark:bg-gray-800"
                        />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: t("contentRequired") || "City is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("registeredCity")}
                        </label>
                        <Input
                          {...field}
                          placeholder="e.g. Cairo"
                          className="min-h-[56px] bg-[#F9F9F9] dark:bg-gray-800"
                        />
                        {errors.city && (
                          <span className="text-sm text-red-500 mt-1 block">
                            {errors.city.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: t("contentRequired") || "Phone is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <label className="font-semibold text-[#717171] dark:text-white">
                          Phone Number
                        </label>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+20 123 456 7890"
                          className="min-h-[56px] bg-[#F9F9F9] dark:bg-gray-800"
                        />
                        {errors.phone && (
                          <span className="text-sm text-red-500 mt-1 block">
                            {errors.phone.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center gap-6 mt-10">
                  <Button type="submit" className="w-48 text-white">
                    {t("add")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpenModal(false);
                      reset();
                    }}
                    className="w-48 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ResponsiveDialog>
      </div>
    </div>
  );
};

export default Drivers;

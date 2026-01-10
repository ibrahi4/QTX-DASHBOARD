/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { Controller, useForm } from "react-hook-form";
import { FormItem } from "@/components/ui/form";
import DateInput from "@/components/ui/dateInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LuCircleFadingPlus } from "react-icons/lu";
import { BiSolidEdit } from "react-icons/bi";
import { HiMiniTrash } from "react-icons/hi2";
import feadback from "../../public/assets/Feedback Icon.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import {
  getAllDrivers,
  approveDriver,
  rejectDriver,
  createDriver,
} from "@/services/adminService";

const Drivers = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [openModalDel, setOpenModalDel] = useState(false);
  const [currentDriverToDelete, setCurrentDriverToDelete] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      vehicleType: "",
      vehiclePlateNumber: "",
    },
  });

  // جلب كل السائقين من الـ backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllDrivers();
        const driversData = res.data || [];

        const mappedDrivers = driversData.map((driver) => ({
          id: driver._id,
          img: driver.profileImg || "/assets/driver.png",
          name: driver.fullName || t("notSpecified"),
          city: driver.city || "غير محدد",
          kind:
            driver.vehicleType ||
            driver.driverProfile?.vehicleName ||
            "غير محدد",
          num_car:
            driver.vehiclePlateNumber ||
            driver.driverProfile?.vehiclePlateNumber ||
            "-",
          paper_driver: driver.driverProfile?.licenseFront ? "✔" : "✖",
          paper_car: driver.driverProfile?.carRegFront ? "✔" : "✖",
          status:
            driver.status === "active"
              ? t("approved")
              : driver.status === "pending"
              ? t("pending")
              : t("rejected"),
          date: driver.createdAt
            ? new Date(driver.createdAt).toLocaleDateString("ar-EG")
            : "-",
        }));

        setDrivers(mappedDrivers);
      } catch (err) {
        console.error("Failed to load drivers:", err);
        setError(t("failedToLoad") || "فشل تحميل السائقين");
        toast.error(t("failedToLoad") || "فشل تحميل السائقين");
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [t]);

  // إضافة سائق جديد
  const onSubmit = async (formData) => {
    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        vehicleType: formData.vehicleType,
        vehiclePlateNumber: formData.vehiclePlateNumber,
      };

      await createDriver(payload);
      toast.success(t("driverAdded") || "تم إضافة السائق بنجاح");

      setOpenModal(false);
      reset();

      // إعادة جلب القائمة بعد الإضافة
      const res = await getAllDrivers();
      const newData = res.data || [];
      const mapped = newData.map((driver) => ({
        id: driver._id,
        img: driver.profileImg || "/assets/driver.png",
        name: driver.fullName || t("notSpecified"),
        city: driver.city || "غير محدد",
        kind:
          driver.vehicleType || driver.driverProfile?.vehicleName || "غير محدد",
        num_car:
          driver.vehiclePlateNumber ||
          driver.driverProfile?.vehiclePlateNumber ||
          "-",
        paper_driver: driver.driverProfile?.licenseFront ? "✔" : "✖",
        paper_car: driver.driverProfile?.carRegFront ? "✔" : "✖",
        status:
          driver.status === "active"
            ? t("approved")
            : driver.status === "pending"
            ? t("pending")
            : t("rejected"),
        date: driver.createdAt
          ? new Date(driver.createdAt).toLocaleDateString("ar-EG")
          : "-",
      }));

      setDrivers(mapped);
    } catch (err) {
      toast.error(t("addFailed") || "فشل في إضافة السائق");
    }
  };

  // فلترة محلية
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.city?.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.kind?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const headData = [
    t("drivers"),
    t("carType"),
    t("carNumber"),
    t("driverDocs"),
    t("carDocs"),
    t("driverStatus"),
    t("joinDate"),
    t("actions"),
  ];

  return (
    <div className="container py-8">
      <div className="mt-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-[#222222] dark:text-white">
            {t("drivers")}
          </h1>
          <div>
            <Button
              onClick={() => setOpenModal(true)}
              className="flex min-h-[40px] items-center gap-2 text-white"
            >
              <LuCircleFadingPlus />
              <span>{t("addDriver")}</span>
            </Button>
          </div>
        </div>

        <div className="p-4 mt-8 bg-white rounded-sm dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="text-[#111111] font-medium dark:text-white">
              {t("driversList")}
            </div>
            <div className="relative flex items-center mx-auto min-w-[300px]">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                placeholder={t("searchForDriver")}
              />
              <CiSearch
                size={20}
                className="absolute ltr:left-2 rtl:right-2 text-[#888888] dark:text-white"
              />
            </div>

            {/* فلاتر إضافية (يمكن تفعيلها لاحقًا) */}
          </div>

          <div className="mt-8">
            <ArabicTable headData={headData}>
              {loading ? (
                <Loading
                  type="table"
                  status={true}
                  td={headData.length}
                  tr={8}
                />
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={headData.length}
                    className="text-center text-red-500 py-10"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredDrivers.length > 0 ? (
                filteredDrivers.map((item) => (
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

                    <TableCell>{item.kind}</TableCell>
                    <TableCell className="text-primary-1">
                      {item.num_car}
                    </TableCell>
                    <TableCell>
                      <img
                        src={feadback}
                        alt="feedback"
                        className="inline-block w-5 h-5"
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={feadback}
                        alt="feedback"
                        className="inline-block w-5 h-5"
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        className={`w-fit mx-auto px-3 py-1 rounded-md font-medium ${
                          item.status === t("approved")
                            ? "bg-[#E6F4EF] text-[#11A849]"
                            : item.status === t("rejected")
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </div>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/users/drivers/${item.id}`}
                          className="bg-[#EEEFFC] rounded-md p-1 hover:bg-[#d0d0ff] transition"
                        >
                          <BiSolidEdit className="w-4 h-4 text-primary-1" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-[#FCE8E6] rounded-md p-1 hover:bg-[#f8d0ce]"
                          onClick={() => {
                            setCurrentDriverToDelete(item);
                            setOpenModalDel(true);
                          }}
                        >
                          <HiMiniTrash className="w-4 h-4 text-red" />
                        </Button>
                      </div>
                    </TableCell>
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

        {/* مودال إضافة سائق */}
        <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("addDriver")}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center gap-4">
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("name")}
                      </label>
                      <Input
                        {...field}
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                        {errors.fullName?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="vehicleType"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("carType")}
                      </label>
                      <Input
                        {...field}
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                        {errors.vehicleType?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <Controller
                  name="vehiclePlateNumber"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("carNumber")}
                      </label>
                      <Input
                        {...field}
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                        {errors.vehiclePlateNumber?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="appointment"
                  control={control}
                  rules={{ required: t("dateRequired") }}
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("joinDate")}
                      </label>
                      <DateInput
                        value={field.value || null}
                        onChange={field.onChange}
                        triggerClassName="min-h-[56px] dark:text-white dark:bg-gray-800"
                      />
                      <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                        {errors.appointment?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("registeredCity")}
                      </label>
                      <Input
                        {...field}
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                        {errors.city?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="journy"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("driverStatus")}
                      </label>
                      <Input
                        type="number"
                        {...field}
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                        {errors.journy?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                <Button type="submit" className="text-white w-[200px]">
                  {t("add")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    reset();
                  }}
                  className="bg-red hover:bg-red text-white w-[200px]"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </div>
        </ResponsiveDialog>

        {/* مودال تأكيد الحذف */}
        <ResponsiveDialog open={openModalDel} setOpen={setOpenModalDel}>
          <div className="p-10 text-center">
            <h2 className="text-xl font-bold mb-4">
              {t("confirmDeleteDriver") || "هل أنت متأكد من حذف هذا السائق؟"}
            </h2>
            <div className="flex justify-center gap-6">
              <Button
                onClick={() => {
                  // هنا يمكن إضافة API لحذف السائق لاحقًا
                  toast.success(t("deleted") || "تم الحذف بنجاح (محلي)");
                  setDrivers((prev) =>
                    prev.filter((d) => d.id !== currentDriverToDelete?.id)
                  );
                  setOpenModalDel(false);
                }}
                className="text-white"
              >
                {t("yes")}
              </Button>
              <Button
                onClick={() => setOpenModalDel(false)}
                className="bg-red hover:bg-red text-white"
              >
                {t("no")}
              </Button>
            </div>
          </div>
        </ResponsiveDialog>
      </div>
    </div>
  );
};

export default Drivers;

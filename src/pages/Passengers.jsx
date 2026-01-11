/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
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
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { Switch } from "@/components/ui/switch";
import { BiSolidEdit } from "react-icons/bi";
import { HiMiniTrash } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";
import DateInput from "@/components/ui/dateInput";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  getAllPassengers,
  createPassenger,
  togglePassengerActivation,
  deletePassenger,
} from "@/services/adminService"; // تأكد من إنشاء هذه الدوال

const Passengers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDel, setOpenModalDel] = useState(false);
  const [currentPartToDelete, setCurrentPartToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearch] = useState("");

  const { t } = useTranslation();

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {},
  });

  // جلب بيانات الركاب من الـ backend
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        setLoading(true);
        const res = await getAllPassengers();
        setPassengers(res.data || res || []);
        console.log("Fetched passengers:", res.data || res || []);
      } catch (err) {
        console.error("Error fetching passengers:", err);
        setError(t("failedToLoad") || "Failed to load passengers");
        toast.error(t("failedToLoad") || "Failed to load passengers");
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  // إضافة راكب جديد
  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        // journeyCount: data.journey, // إذا كان الـ backend يدعمه
        // joinDate: data.appointment,
      };

      await createPassenger(payload);

      toast.success(t("passengerAdded") || "Passenger added successfully");
      setOpenModal(false);
      reset();

      // تحديث القائمة بعد الإضافة
      const res = await getAllPassengers();
      setPassengers(res.data || res || []);
    } catch (err) {
      toast.error(t("addFailed") || "Failed to add passenger");
    }
  };

  // تحديد/إلغاء تحديد صف واحد
  const handleCheckboxChange = (passengerId) => {
    setSelectedRows((prev) =>
      prev.includes(passengerId)
        ? prev.filter((id) => id !== passengerId)
        : [...prev, passengerId]
    );
  };

  // تحديد/إلغاء تحديد الكل
  const handleSelectAll = () => {
    if (selectedRows.length === passengers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(passengers.map((p) => p._id || p.id));
    }
  };

  // حذف متعدد
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    try {
      await Promise.all(selectedRows.map((id) => deletePassenger(id)));
      toast.success(t("deletedSuccess") || "Selected passengers deleted");
      const res = await getAllPassengers();
      setPassengers(res.data || res || []);
      setSelectedRows([]);
    } catch (err) {
      toast.error(t("deleteFailed") || "Failed to delete passengers");
    }
  };

  // حذف واحد
  const handleSingleDelete = async () => {
    if (!currentPartToDelete) return;

    try {
      await deletePassenger(currentPartToDelete._id || currentPartToDelete.id);
      toast.success(t("deleted") || "Passenger deleted");
      const res = await getAllPassengers();
      setPassengers(res.data || res || []);
      setOpenModalDel(false);
      setCurrentPartToDelete(null);
    } catch (err) {
      toast.error(t("deleteFailed") || "Failed to delete passenger");
    }
  };

  // تفعيل/تعطيل الحساب
  const handleToggleActivation = async (passengerId, currentStatus) => {
    try {
      await togglePassengerActivation(passengerId, !currentStatus);
      toast.success(t("statusUpdated") || "Activation status updated");
      const res = await getAllPassengers();
      setPassengers(res.data || res || []);
    } catch (err) {
      toast.error(t("updateFailed") || "Failed to update status");
    }
  };

  const headData = [
    t("passengerName"),
    t("email"),
    t("phone"),
    t("joinDate"),

    t("activation"),
    t("actions"),
  ];

  // فلترة البحث
  const filteredPassengers = passengers.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.phone?.includes(searchValue) ||
      p.city?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="mt-4 bg-white rounded-[20px] p-6 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-[#222222] dark:text-white">
            {t("passengerList")}
          </h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center mx-auto">
              <CiSearch
                size={22}
                className="absolute ltr:left-2 rtl:right-2 text-[#888888] dark:text-white"
              />
              <Input
                value={searchValue}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="min-h-[22px] ltr:pl-[30px] dark:bg-gray-900 placeholder:dark:text-gray-400 bg-[#F5F7FA] rtl:pr-[30px] rounded-md border max-xl:placeholder:text-sm focus:border-[#C9CDF6] focus:ring-0 placeholder:text-[#888888] py-2 ps-4 pe-8 lg:pl-10 focus:outline-none focus:ring-bg-[#C9CDF6] max-xl:max-w-[300px] max-sm:max-w-full lg:w-[300px]"
                placeholder={t("searchUser")}
              />
            </div>

            <div>
              <Controller
                name="join"
                control={control}
                rules={{ required: t("dateRequired") }}
                render={({ field }) => (
                  <FormItem className="relative w-full text-black">
                    <DateInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("joinDate")}
                    />
                    <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                      {errors.join?.message}
                    </span>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <Switch
                checked={
                  selectedRows.length === passengers.length &&
                  passengers.length > 0
                }
                onCheckedChange={handleSelectAll}
                className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
              />
            </div>
            <div>
              <Button
                onClick={handleBulkDelete}
                disabled={selectedRows.length === 0}
                className="bg-transparent text-[14px] text-[#EC373B] border border-[#EC373B] shadow-none hover:bg-[#EC373B] hover:text-white transition duration-200 ease-in-out flex items-center gap-2 disabled:opacity-50"
              >
                <RiDeleteBinLine size={16} />
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ArabicTable headData={headData}>
            {loading ? (
              <Loading type="table" status={true} td={headData.length} tr={8} />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={headData.length}
                  className="text-center py-10 text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredPassengers.length > 0 ? (
              filteredPassengers.map((item, i) => (
                <TableRow
                  key={item._id || item.id}
                  className={`text-center border-t hover:dark:bg-gray-800 dark:bg-${
                    i % 2 === 0 ? "gray-800" : ""
                  } bg-${i % 2 === 0 ? "[#F5F7FA]" : ""}`}
                >
                  <TableCell>
                    <input
                      className="mx-2"
                      type="checkbox"
                      checked={selectedRows.includes(item._id || item.id)}
                      onChange={() => handleCheckboxChange(item._id || item.id)}
                    />
                    {item.fullName || item.name || "Not specified"}
                  </TableCell>
                  <TableCell>{item.email || "-"}</TableCell>
                  <TableCell>{item.phone || "-"}</TableCell>
                  <TableCell>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("ar-EG")
                      : item.date || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <Switch
                        checked={item.isActive ?? false}
                        onCheckedChange={(checked) =>
                          handleToggleActivation(
                            item._id || item.id,
                            item.isActive
                          )
                        }
                        className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#3872FA]"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/users/passengers/${item._id || item.id}`}
                        className="bg-[#EEEFFC] rounded-md p-1"
                      >
                        <BiSolidEdit className="w-4 h-4 text-primary-1" />
                      </Link>
                      <Button
                        onClick={() => {
                          setCurrentPartToDelete(item);
                          setOpenModalDel(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="bg-[#FCE8E6] rounded-md h-6 !p-1 hover:bg-[#FCE8E6]"
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

        {/* Confirmation Modal for Delete */}
        <ResponsiveDialog open={openModalDel} setOpen={setOpenModalDel}>
          <div className="p-10 text-center">
            <h2 className="text-xl font-bold mb-6">
              {t("confirmDelete") ||
                "Are you sure you want to delete this passenger?"}
            </h2>
            <div className="flex justify-center gap-6">
              <Button onClick={handleSingleDelete} className="text-white">
                {t("yes")}
              </Button>
              <Button
                onClick={() => {
                  setOpenModalDel(false);
                  setCurrentPartToDelete(null);
                }}
                className="bg-red hover:bg-red text-white"
              >
                {t("no")}
              </Button>
            </div>
          </div>
        </ResponsiveDialog>

        {/* Add Passenger Modal */}
        <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("addPassenger")}
            </h2>

            <div>
              <Form>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8 text-white"
                >
                  <div className="flex items-center gap-4">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: t("contentRequired") }}
                      render={({ field }) => (
                        <FormItem className="relative w-full">
                          <label className="font-semibold text-[#717171] dark:text-white">
                            {t("name")}
                          </label>
                          <Input
                            {...field}
                            className="no-focus dark:bg-gray-800 dark:text-white dark:border-gray-700 min-h-[56px] bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                          />
                          <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                            {errors.name?.message}
                          </span>
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: t("contentRequired"),
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: t("enterValidEmail"),
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="relative w-full">
                          <label className="font-semibold text-[#717171] dark:text-white">
                            {t("email")}
                          </label>
                          <Input
                            {...field}
                            type="email"
                            className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 dark:border-gray-700 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                          />
                          <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                            {errors.email?.message}
                          </span>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: t("contentRequired"),
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: t("enterValidPhone"),
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="relative w-full">
                          <label className="font-semibold text-[#717171] dark:text-white">
                            {t("phone")}
                          </label>
                          <Input
                            {...field}
                            type="tel"
                            className="no-focus min-h-[56px] dark:bg-gray-800 dark:text-white dark:border-gray-700 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                          />
                          <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                            {errors.phone?.message}
                          </span>
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="appointment"
                      control={control}
                      rules={{ required: t("dateRequired") }}
                      render={({ field }) => (
                        <FormItem className="relative w-full text-black">
                          <label className="font-semibold text-[#717171] dark:text-white">
                            {t("joinDate")}
                          </label>
                          <DateInput
                            value={field.value}
                            onChange={field.onChange}
                            triggerClassName="min-h-[56px] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                      render={({ field }) => (
                        <FormItem className="relative w-full">
                          <label className="font-semibold text-[#717171] dark:text-white">
                            {t("registeredCity")}
                          </label>
                          <Input
                            {...field}
                            className="no-focus min-h-[56px] dark:bg-gray-800 dark:text-white dark:border-gray-700 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                          />
                          <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                            {errors.city?.message}
                          </span>
                        </FormItem>
                      )}
                    />

                    <Controller
                      name="journey"
                      control={control}
                      rules={{ required: t("contentRequired") }}
                      render={({ field }) => (
                        <FormItem className="relative w-full">
                          <label className="font-semibold text-[#717171] dark:text-white">
                            {t("journeysCount")}
                          </label>
                          <Input
                            type="number"
                            {...field}
                            className="no-focus min-h-[56px] dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                          />
                          <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                            {errors.journey?.message}
                          </span>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <Button type="submit" className="w-[200px] text-white">
                      <span>{t("add")}</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setOpenModal(false);
                        reset();
                      }}
                      className="bg-red hover:bg-red w-[200px] text-white"
                    >
                      <span>{t("cancel")}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </ResponsiveDialog>
      </div>
    </div>
  );
};

export default Passengers;

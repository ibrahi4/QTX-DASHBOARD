/* eslint-disable no-unused-vars */
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
  getAllDiscountCodes,
  createDiscountCode,
  toggleDiscountCodeActivation,
  deleteDiscountCode,
} from "@/services/adminService";

const DiscountCodes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDel, setOpenModalDel] = useState(false);
  const [currentCodeToDelete, setCurrentCodeToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearch] = useState("");

  const { t } = useTranslation();

  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      code: "",
      usageLimit: "",
      discountRate: "",
      startDate: null,
      endDate: null,
    },
  });

  // جلب كل أكواد الخصم من الـ backend
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true);
        const res = await getAllDiscountCodes();
        setCodes(res.data || res || []);
      } catch (err) {
        console.error("Failed to load discount codes:", err);
        setError(t("failedToLoad") || "Failed to load discount codes");
        toast.error(t("failedToLoad") || "Failed to load discount codes");
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [t]);

  // إضافة كود خصم جديد
  const onSubmit = async (data) => {
    try {
      const payload = {
        code: data.code,
        usageLimit: Number(data.usageLimit),
        discountRate: Number(data.discountRate),
        startDate: data.startDate,
        endDate: data.endDate,
      };

      await createDiscountCode(payload);

      toast.success(t("codeAdded") || "Discount code added successfully");

      setOpenModal(false);
      reset();

      // تحديث القائمة
      const res = await getAllDiscountCodes();
      setCodes(res.data || res || []);
    } catch (err) {
      toast.error(t("addFailed") || "Failed to add discount code");
    }
  };

  // تحديد/إلغاء تحديد صف
  const handleCheckboxChange = (codeId) => {
    setSelectedRows((prev) =>
      prev.includes(codeId)
        ? prev.filter((id) => id !== codeId)
        : [...prev, codeId]
    );
  };

  // تحديد/إلغاء تحديد الكل
  const handleSelectAll = () => {
    if (selectedRows.length === codes.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(codes.map((c) => c._id || c.id));
    }
  };

  // حذف متعدد
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;

    try {
      await Promise.all(selectedRows.map((id) => deleteDiscountCode(id)));
      toast.success(t("deletedSuccess") || "Selected codes deleted");
      const res = await getAllDiscountCodes();
      setCodes(res.data || res || []);
      setSelectedRows([]);
    } catch (err) {
      toast.error(t("deleteFailed") || "Failed to delete codes");
    }
  };

  // حذف واحد
  const handleSingleDelete = async () => {
    if (!currentCodeToDelete) return;

    try {
      await deleteDiscountCode(
        currentCodeToDelete._id || currentCodeToDelete.id
      );
      toast.success(t("deleted") || "Code deleted");
      const res = await getAllDiscountCodes();
      setCodes(res.data || res || []);
      setOpenModalDel(false);
      setCurrentCodeToDelete(null);
    } catch (err) {
      toast.error(t("deleteFailed") || "Failed to delete code");
    }
  };

  // تفعيل/تعطيل الكود
  const handleToggleActivation = async (codeId, currentStatus) => {
    try {
      await toggleDiscountCodeActivation(codeId, !currentStatus);
      toast.success(t("statusUpdated") || "Activation status updated");
      const res = await getAllDiscountCodes();
      setCodes(res.data || res || []);
    } catch (err) {
      toast.error(t("updateFailed") || "Failed to update status");
    }
  };

  const headData = [
    t("codes"),
    t("startDate"),
    t("discountRate"),
    t("endDate"),
    t("activation"),
    t("actions"),
  ];

  // فلترة البحث
  const filteredCodes = codes.filter((c) =>
    c.code?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div>
        <div className="p-6 bg-white rounded-[20px] dark:bg-gray-900">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-medium text-[#222222] dark:text-white">
              {t("codes")}
            </h1>
            <div>
              <Button
                onClick={() => setOpenModal(true)}
                className="flex min-h-[40px] items-center gap-2 text-white"
              >
                <LuCircleFadingPlus />
                <span>{t("addNewCode")}</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex items-center">
                <Input
                  value={searchValue}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                  placeholder={t("searchUser")}
                />
                <div className="absolute ltr:left-2 rtl:right-2">
                  <CiSearch
                    size={20}
                    className="text-[#888888] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <Select>
                  <SelectTrigger className="w-[150px] focus:border-[#C9CDF6] focus:ring-0 dark:text-white">
                    <SelectValue placeholder={t("allDrivers")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Controller
                  name="join"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="relative w-full text-black">
                      <DateInput
                        value={field.value || null}
                        onChange={field.onChange}
                        placeholder={t("date")}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <Switch
                  checked={
                    selectedRows.length === filteredCodes.length &&
                    filteredCodes.length > 0
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
              ) : filteredCodes.length > 0 ? (
                filteredCodes.map((item, i) => (
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
                        onChange={() =>
                          handleCheckboxChange(item._id || item.id)
                        }
                      />
                      {item.code || "-"}
                    </TableCell>
                    <TableCell>
                      {item.startDate
                        ? new Date(item.startDate).toLocaleDateString("ar-EG")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.discountRate ? `${item.discountRate}%` : "-"}
                    </TableCell>
                    <TableCell>
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("ar-EG")
                        : "-"}
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
                        <Button className="bg-[#EEEFFC] rounded-md p-1">
                          <BiSolidEdit className="w-4 h-4 text-primary-1" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentCodeToDelete(item);
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
        </div>

        {/* Delete Confirmation Modal */}
        <ResponsiveDialog open={openModalDel} setOpen={setOpenModalDel}>
          <div className="p-10 text-center">
            <h2 className="text-xl font-bold mb-4">
              {t("confirmDelete") ||
                "Are you sure you want to delete this code?"}
            </h2>
            <div className="flex justify-center gap-6">
              <Button onClick={handleSingleDelete} className="text-white">
                {t("yes")}
              </Button>
              <Button
                onClick={() => {
                  setOpenModalDel(false);
                  setCurrentCodeToDelete(null);
                }}
                className="bg-red hover:bg-red text-white"
              >
                {t("no")}
              </Button>
            </div>
          </div>
        </ResponsiveDialog>

        {/* Add New Code Modal */}
        <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
          <div className="p-10">
            <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
              {t("createDiscountCode")}
            </h2>

            <Form>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <Controller
                    name="code"
                    control={control}
                    rules={{ required: t("contentRequired") }}
                    render={({ field }) => (
                      <FormItem className="relative w-full">
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("enterCode")}
                        </label>
                        <Input
                          {...field}
                          className="no-focus min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9] text-primary-1 font-medium focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                        />
                        <span className="text-sm text-red-500 mt-1 block">
                          {errors.code?.message}
                        </span>
                      </FormItem>
                    )}
                  />

                  <Controller
                    name="usageLimit"
                    control={control}
                    rules={{ required: t("contentRequired") }}
                    render={({ field }) => (
                      <FormItem className="relative w-full">
                        <label className="font-semibold text-[#717171] dark:text-white">
                          {t("usageLimit")}
                        </label>
                        <Input
                          {...field}
                          type="number"
                          className="no-focus min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9] text-primary-1 font-medium focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                        />
                        <span className="text-sm text-red-500 mt-1 block">
                          {errors.usageLimit?.message}
                        </span>
                      </FormItem>
                    )}
                  />
                </div>

                <Controller
                  name="discountRate"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("discountRate")}
                      </label>
                      <Input
                        {...field}
                        type="number"
                        className="no-focus min-h-[56px] dark:bg-gray-800 dark:text-white bg-[#F9F9F9] text-primary-1 font-medium focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.discountRate?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: t("dateRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("startDate")}
                      </label>
                      <DateInput
                        value={field.value || null}
                        onChange={field.onChange}
                        triggerClassName="min-h-[56px]"
                        placeholder={t("startDate")}
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.startDate?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: t("dateRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("expiryDate")}
                      </label>
                      <DateInput
                        value={field.value || null}
                        onChange={field.onChange}
                        triggerClassName="min-h-[56px]"
                        placeholder={t("expiryDate")}
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.endDate?.message}
                      </span>
                    </FormItem>
                  )}
                />

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
            </Form>
          </div>
        </ResponsiveDialog>
      </div>
    </div>
  );
};

export default DiscountCodes;

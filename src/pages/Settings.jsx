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
import { Label } from "@/components/ui/label";
import DateInput from "@/components/ui/dateInput";
import { BiSolidEdit } from "react-icons/bi";
import { HiMiniTrash } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  getAllCities,
  createCity,
  updateCityStatus,
  deleteCity,
} from "@/services/adminService";

const Settings = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDel, setOpenModalDel] = useState(false);
  const [currentCityToDelete, setCurrentCityToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearch] = useState("");

  const { t } = useTranslation();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      minFare: "",
      pricePerKm: "",
      isActive: true,
      enableRatings: true,
      enablePayments: true,
      enablePromotions: true,
    },
  });

  // جلب المدن من الـ backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await getAllCities();
        setCities(res.data || res || []);
      } catch (err) {
        console.error("Failed to load cities:", err);
        setError(t("failedToLoad") || "Failed to load cities");
        toast.error(t("failedToLoad") || "Failed to load cities");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [t]);

  // إضافة مدينة جديدة
  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        minFare: Number(data.minFare),
        pricePerKm: Number(data.pricePerKm),
        isActive: data.isActive ?? true,
        features: {
          ratings: data.enableRatings ?? true,
          payments: data.enablePayments ?? true,
          promotions: data.enablePromotions ?? true,
        },
      };

      await createCity(payload);

      toast.success(t("cityAdded") || "City added successfully");
      setOpenModal(false);
      reset();

      // تحديث القائمة
      const res = await getAllCities();
      setCities(res.data || res || []);
    } catch (err) {
      toast.error(t("addFailed") || "Failed to add city");
    }
  };

  // حذف مدينة
  const handleDelete = async () => {
    if (!currentCityToDelete) return;

    try {
      await deleteCity(currentCityToDelete._id || currentCityToDelete.id);
      toast.success(t("deleted") || "City deleted");
      const res = await getAllCities();
      setCities(res.data || res || []);
      setOpenModalDel(false);
      setCurrentCityToDelete(null);
    } catch (err) {
      toast.error(t("deleteFailed") || "Failed to delete city");
    }
  };

  const handleCheckboxChange = (cityId) => {
    setSelectedRows((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    );
  };

  const headData = [
    t("cityName"),
    t("minFareAlt"),
    t("pricePerKm"),
    t("status"),
    t("regions"),
    t("actions"),
  ];

  // فلترة البحث
  const filteredCities = cities.filter((c) =>
    c.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="p-4 mt-8 space-y-5 bg-white rounded-[20px] shadow-main dark:bg-gray-900">
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium">{t("systemSettings")}</h1>
            <div>
              <Button
                onClick={() => setOpenModal(true)}
                className="flex min-h-[40px] items-center gap-2 text-white"
              >
                <LuCircleFadingPlus />
                <span>{t("addCity")}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 mt-8">
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <div className="relative flex items-center">
              <Input
                value={searchValue}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-[5px] border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                placeholder={t("searchByNamePhoneEmail")}
              />
              <CiSearch
                size={20}
                className="absolute right-2 text-[#888888] dark:text-white"
              />
            </div>

            <Select>
              <SelectTrigger className="w-[150px] dark:text-white focus:border-[#C9CDF6] dark:bg-gray-800 focus:ring-0">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="inactive">{t("inactive")}</SelectItem>
              </SelectContent>
            </Select>

            <Controller
              name="appointment"
              control={control}
              render={({ field }) => (
                <FormItem className="relative text-black w-[150px]">
                  <DateInput
                    value={field.value || null}
                    onChange={field.onChange}
                    triggerClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder={t("date")}
                  />
                </FormItem>
              )}
            />
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
              ) : filteredCities.length > 0 ? (
                filteredCities.map((item) => (
                  <TableRow
                    key={item._id || item.id}
                    className="text-center border-t hover:dark:bg-gray-800"
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
                      {item.name || "-"}
                    </TableCell>
                    <TableCell>
                      {item.minFare ? `${item.minFare} ريال` : "-"}
                    </TableCell>
                    <TableCell>
                      {item.pricePerKm ? `${item.pricePerKm} ريال` : "-"}
                    </TableCell>
                    <TableCell>
                      <p
                        className={`!w-fit block mx-auto px-2 py-2 rounded-md font-semibold text-sm ${
                          item.isActive
                            ? "text-[#11A849] bg-[#E6F4EF]"
                            : "text-red-600 bg-red-100"
                        }`}
                      >
                        {item.isActive ? t("active") : t("inactive")}
                      </p>
                    </TableCell>
                    <TableCell>
                      {item.regions?.length || 0} {t("regions")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button className="hover:bg-[#EEEFFC] bg-[#EEEFFC] rounded-md h-6 p-1">
                          <BiSolidEdit className="w-4 h-4 text-primary-1" />
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentCityToDelete(item);
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
      </div>

      {/* Delete Confirmation Modal */}
      <ResponsiveDialog open={openModalDel} setOpen={setOpenModalDel}>
        <div className="text-center p-6">
          <h2 className="mb-4 text-xl font-medium md:text-2xl">
            {t("confirmDeletion")}
          </h2>
          <p>
            {t("areUSureToDelete")} {currentCityToDelete?.name}؟
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={handleDelete}
              className="text-white bg-red hover:bg-red"
            >
              {t("delete")}
            </Button>
            <Button
              onClick={() => {
                setOpenModalDel(false);
                setCurrentCityToDelete(null);
              }}
              className="text-white"
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Add City Modal */}
      <ResponsiveDialog open={openModal} setOpen={setOpenModal}>
        <div className="p-10">
          <h2 className="mb-4 text-xl font-medium text-center md:text-2xl">
            {t("addCity")}
          </h2>

          <Form>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("cityName")}
                      </label>
                      <Input
                        {...field}
                        placeholder={t("cityName")}
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.name?.message}
                      </span>
                    </FormItem>
                  )}
                />

                <Controller
                  name="minFare"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("minFareAlt")}
                      </label>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.minFare?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-4">
                <Controller
                  name="pricePerKm"
                  control={control}
                  rules={{ required: t("contentRequired") }}
                  render={({ field }) => (
                    <FormItem className="relative w-full">
                      <label className="font-semibold text-[#717171] dark:text-white">
                        {t("pricePerKm")}
                      </label>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="no-focus min-h-[56px] dark:text-white dark:bg-gray-800 bg-[#F9F9F9] text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                      />
                      <span className="text-sm text-red-500 mt-1 block">
                        {errors.pricePerKm?.message}
                      </span>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-start">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 p-4 rounded-lg">
                      <Label className="text-sm font-medium text-gray-700 dark:text-white">
                        {t("status")}
                      </Label>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                      />
                    </FormItem>
                  )}
                />
              </div>

              <h2 className="text-center text-gray-700 dark:text-white">
                {t("enabledFeatures")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  name="enableRatings"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 p-4 rounded-lg shadow-sm">
                      <Label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
                        {t("enableRatings")}
                      </Label>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                      />
                    </FormItem>
                  )}
                />

                <Controller
                  name="enablePayments"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 p-4 rounded-lg shadow-sm">
                      <Label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
                        {t("enableDigitalPayments")}
                      </Label>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                      />
                    </FormItem>
                  )}
                />

                <Controller
                  name="enablePromotions"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-4 p-4 rounded-lg shadow-sm">
                      <Label className="text-sm font-medium text-gray-700 dark:text-white whitespace-nowrap">
                        {t("enablePromotions")}
                      </Label>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                        className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-[#11A849]"
                      />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                <Button type="submit" className="dark:text-white">
                  {t("add")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    reset();
                  }}
                  className="bg-red hover:bg-red dark:text-white"
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

export default Settings;

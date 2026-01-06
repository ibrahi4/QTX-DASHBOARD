import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SlPicture } from "react-icons/sl";
import { toast } from "react-hot-toast";
import { getPassengerById, updatePassenger } from "@/services/adminService";

const PassengerInfo = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [passenger, setPassenger] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      profile: null,
    },
  });

  useEffect(() => {
    const fetchPassenger = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res = await getPassengerById(id);
        const data = res.data || res;

        setPassenger(data);

        reset({
          name: data.fullName || data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          profile: null,
        });
      } catch (err) {
        console.error("Failed to load passenger:", err);
        toast.error(t("failedToLoad") || "Failed to load passenger data");
      } finally {
        setLoading(false);
      }
    };

    fetchPassenger();
  }, [id, reset, t]);

  const onSubmit = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("fullName", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("city", formData.city);

      if (formData.profile) {
        payload.append("profileImg", formData.profile);
      }

      await updatePassenger(id, payload);

      toast.success(t("changesSaved") || "Changes saved successfully");

      const res = await getPassengerById(id);
      setPassenger(res.data || res);
    } catch (err) {
      console.error("Failed to update passenger:", err);
      toast.error(t("saveFailed") || "Failed to save changes");
    }
  };

  if (loading) {
    return (
      <main className="container py-20 text-center text-xl">
        {t("loading") || "Loading..."}
      </main>
    );
  }

  if (!passenger) {
    return (
      <main className="container py-20 text-center text-red-500 text-xl">
        {t("passengerNotFound") || "Passenger not found"}
      </main>
    );
  }

  return (
    <main className="container py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 mt-8 space-y-5 bg-white rounded-sm dark:bg-gray-900"
      >
        <h1 className="text-2xl font-medium text-[#222222] dark:text-white my-5">
          {t("passengerDetails")}
        </h1>

        <div className="flex items-center gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: t("contentRequired") }}
            render={({ field }) => (
              <FormItem className="relative w-full px-5 py-2 border dark:bg-gray-800 border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold text-[#717171] dark:text-white">
                  {t("name")}
                </label>
                <Input
                  type="text"
                  {...field}
                  className="no-focus p-0 dark:text-white !m-0 min-h-[35px] border-0 text-black shadow-none focus-visible:ring-0"
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red-500">
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
                message: t("enterValidEmail") || "Please enter a valid email",
              },
            }}
            render={({ field }) => (
              <FormItem className="relative w-full px-5 py-2 border dark:bg-gray-800 border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold text-[#717171] dark:text-white">
                  {t("email")}
                </label>
                <Input
                  type="email"
                  {...field}
                  className="no-focus p-0 !m-0 min-h-[35px] dark:text-white border-0 text-black shadow-none focus-visible:ring-0"
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red-500">
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
                value: /^[0-9+\-\s]{10,15}$/,
                message:
                  t("enterValidPhone") || "Please enter a valid phone number",
              },
            }}
            render={({ field }) => (
              <FormItem className="relative w-full px-5 py-2 border dark:bg-gray-800 border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold text-[#717171] dark:text-white">
                  {t("phone")}
                </label>
                <Input
                  type="tel"
                  {...field}
                  className="no-focus p-0 !m-0 min-h-[35px] dark:text-white border-0 text-black shadow-none focus-visible:ring-0"
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red-500">
                  {errors.phone?.message}
                </span>
              </FormItem>
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={{ required: t("contentRequired") }}
            render={({ field }) => (
              <FormItem className="relative w-full px-5 py-2 border dark:bg-gray-800 border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold text-[#717171] dark:text-white">
                  {t("registeredCity")}
                </label>
                <Input
                  type="text"
                  {...field}
                  className="no-focus p-0 !m-0 min-h-[35px] dark:text-white border-0 text-black shadow-none focus-visible:ring-0"
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red-500">
                  {errors.city?.message}
                </span>
              </FormItem>
            )}
          />
        </div>

        <Controller
          name="profile"
          control={control}
          render={({ field }) => (
            <FormItem className="relative w-full px-5 py-2 dark:bg-gray-800 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
              <label
                htmlFor="profile"
                className="font-semibold text-[#717171] h-[75px] dark:text-white flex items-center gap-4 cursor-pointer"
              >
                <SlPicture className="text-xl" />
                {t("profileImage")}
              </label>
              <Input
                type="file"
                id="profile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  field.onChange(file);
                }}
                className="no-focus p-0 dark:text-white !m-0 w-0 h-0 opacity-0 border-0 text-black shadow-none focus-visible:ring-0"
              />

              {field.value &&
                typeof field.value === "object" &&
                field.value.name && (
                  <span className="absolute !m-0 text-sm text-green-600 -translate-y-1/2 left-10 top-1/2">
                    {field.value.name}
                  </span>
                )}

              {!field.value && passenger.profileImg && (
                <span className="absolute !m-0 text-sm text-gray-600 -translate-y-1/2 left-10 top-1/2">
                  {t("currentImage") || "Current"}:{" "}
                  {passenger.profileImg.split("/").pop()}
                </span>
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-8 text-primary-1 bg-[#EEEFFC] hover:bg-[#d0d0ff] transition px-8 py-3 text-lg font-medium"
        >
          {t("saveChanges") || "Save Changes"}
        </Button>
      </form>
    </main>
  );
};

export default PassengerInfo;

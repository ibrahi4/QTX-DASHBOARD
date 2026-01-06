import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SlPicture } from "react-icons/sl";
import { Link } from "react-router-dom";

const AddAD = () => {
  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  const { t } = useTranslation();
  return (
    <main className="container py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 mt-8 space-y-5 bg-white rounded-[20px] shadow-main dark:bg-gray-900"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#222222] dark:text-white my-5">
            {t("addAd")}
          </h1>
          <Link
            to="/"
            className="px-4 py-2 bg-transparent border rounded-md border-primary-1 text-primary-1"
          >
            <span> {t("backToDashboard")}</span>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
          <Controller
            name="ar-label"
            control={control}
            rules={{
              required: t("contentRequired"),
            }}
            render={({ field }) => (
              <FormItem className="relative dark:bg-gray-800 w-full px-5 py-2  border border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold text-[#717171] dark:text-white">
                  {t("arabicTitle")}
                </label>
                <Input
                  type="text"
                  {...field}
                  className="no-focus p-0 !m-0 min-h-[35px] dark:text-white border-0 text-black shadow-none focus-visible:ring-0   "
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                  {errors.name?.message}
                </span>
              </FormItem>
            )}
          />
          <Controller
            name="duration"
            control={control}
            rules={{
              required: t("contentRequired"),
            }}
            render={({ field }) => (
              <FormItem className="relative dark:bg-gray-800 w-full px-5 py-2  border border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold text-[#717171] dark:text-white">
                  {t("adDuration")}
                </label>
                <Input
                  type="text"
                  {...field}
                  className="no-focus p-0 !m-0 min-h-[35px] dark:text-white border-0 text-black shadow-none focus-visible:ring-0   "
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                  {errors.email?.message}
                </span>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
          <Controller
            name="phone"
            control={control}
            rules={{
              required: t("contentRequired"),
            }}
            render={({ field }) => (
              <FormItem className="relative dark:bg-gray-800 w-full px-5 py-2  border border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold dark:text-white text-[#717171]">
                  {t("adViews")}
                </label>
                <Input
                  type="text"
                  {...field}
                  className="no-focus p-0 !m-0 dark:text-white min-h-[35px] border-0 text-black shadow-none focus-visible:ring-0   "
                />
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                  {errors.phone?.message}
                </span>
              </FormItem>
            )}
          />
          <Controller
            name="city"
            control={control}
            rules={{
              required: t("contentRequired"),
            }}
            render={({ field }) => (
              <FormItem className="relative dark:bg-gray-800 w-full px-5 py-2  border border-primary-1 rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
                <label className="font-semibold dark:text-white text-[#717171]">
                  {t("extraDetails")}
                </label>
                <Input
                  type="text"
                  {...field}
                  className="no-focus p-0 !m-0 dark:text-white min-h-[35px] border-0 text-black shadow-none focus-visible:ring-0   "
                  placeholder={t("extraDetails")}
                />
                <span className="absolute bottom-[-23px] dark:text-white left-0 block w-full text-sm text-red">
                  {errors.city?.message}
                </span>
              </FormItem>
            )}
          />
        </div>
        <Controller
          name="profile"
          control={control}
          rules={{
            required: t("contentRequired"),
          }}
          render={({ field }) => (
            <FormItem className="relative dark:bg-gray-800 w-full px-5 py-2  rounded-[5px] focus-within:border-black bg-[#F5F7FA]">
              <label
                htmlFor="profile"
                className="font-semibold dark:text-white text-[#717171] h-[75px] flex items-center gap-4 cursor-pointer"
              >
                <SlPicture />
                {t("uploadImages")}
              </label>
              <Input
                type="file"
                id="profile"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  field.onChange(file);
                }}
                className="no-focus dark:text-white p-0 !m-0 w-0 h-0 opacity-0 border-0 text-black shadow-none focus-visible:ring-0 "
              />

              {field.value && (
                <span className="absolute !m-0 text-sm text-green -translate-y-1/2 left-10 top-1/2">
                  {field.value.name}
                </span>
              )}

              <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                {errors.profile?.message}
              </span>
            </FormItem>
          )}
        />
        <Button type="submit" className="text-white">
          <span> {t("submitAd")}</span>
        </Button>
      </form>
    </main>
  );
};

export default AddAD;

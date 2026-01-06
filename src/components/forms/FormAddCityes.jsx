import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

const FormAddCityes = () => {
  const { t } = useTranslation();
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
  return (
    <div>
      <Form>
        <form
          dir="rtl"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-white "
        >
          <div className="flex items-center gap-4">
            <Controller
              name="name"
              control={control}
              rules={{
                required: t("contentRequired"),
              }}
              render={({ field }) => (
                <FormItem className="relative w-full">
                  <label className="font-semibold text-black"> اسم المدينة</label>
                  <Input
                    placeholder="اخل اسم المدينه"
                    {...field}
                    className="no-focus  min-h-[42px] bg-white text-black focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                  />
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.name?.message}
                  </span>
                </FormItem>
              )}
            />

            <Controller
              name="price"
              control={control}
              rules={{
                required: t("contentRequired"),
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black">
                    {" "}
                    الحد الأدنى للأجرة (ريال){" "}
                  </label>
                  <Input
                    placeholder="  0.00"
                    type="number"
                    {...field}
                    className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                  />
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.price?.message}
                  </span>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <Controller
              name="price"
              control={control}
              rules={{
                required: t("contentRequired"),
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black">
                    {" "}
                    السعر لكل كم (ريال){" "}
                  </label>
                  <Input
                    placeholder="  0.00"
                    type="number"
                    {...field}
                    className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                  />
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.price?.message}
                  </span>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-start ">
            <div className="space-x-4">
              <Controller
                control={control}
                name="send_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg shadow-sm">
                    <Label className="mx-4 text-sm font-medium text-gray-700">
                      الحاله
                    </Label>
                    <Switch
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-green"
                      dir="ltr"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-start ">
            <h2 className="text-gray-700">{t("enabledFeatures")}</h2>

            <div className="space-x-4">
              <Controller
                control={control}
                name="send_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg shadow-sm">
                    <Label className="mx-4 text-sm font-medium text-gray-700">
                      تفعيل التقييمات
                    </Label>
                    <Switch
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-green"
                      dir="ltr"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-x-4">
              <Controller
                control={control}
                name="send_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg shadow-sm">
                    <Label className="mx-4 text-sm font-medium text-gray-700">
                      تفعيل المدفوعات الرقمية
                    </Label>
                    <Switch
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-green"
                      dir="ltr"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-x-4">
              <Controller
                control={control}
                name="send_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg shadow-sm">
                    <Label className="mx-4 text-sm font-medium text-gray-700">
                      تفعيل العروض الترويجية
                    </Label>
                    <Switch
                      className="data-[state=unchecked]:bg-gray-400 data-[state=checked]:bg-green"
                      dir="ltr"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            {/* {loadingAdd ? (
                           <Button
                               disabled
                               type="submit"
                               className="flex min-h-[40px]  items-center gap-2 !mt-12"
                           >
                               <span>
                                   <Spinner className={"text-white"} />
                               </span>
                               <span>جارى التحميل </span>
                           </Button>
                       ) : (
                           <Button
                               type="submit"
                               className="flex min-h-[40px]  items-center gap-2 !mt-12"
                           >
                               {isEditSession ? "تعديل الدليل" : "إضافة الدليل "}
                           </Button>
                       )} */}

            <Button type="submit" className="">
              {/* <span>
                       <Spinner className={"text-white"} />
                     </span> */}
              <span> اضافه </span>
            </Button>

            {/* <Button
                            onClick={() => navigate("/journeys")}
                            className=" bg-red hover:bg-red"
                        >
                            <span>
                       <Spinner className={"text-white"} />
                     </span>
                            <span> الغاء </span>
                        </Button> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormAddCityes;

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { LuCircleFadingPlus } from "react-icons/lu";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { FaBell, FaClipboardCheck } from "react-icons/fa";
import { Spinner } from "@/components/shared/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormAddJourney = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setValue,
    reset,

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
          className="space-y-8 text-white "
        >
          <div className="flex items-center gap-4">
            <Controller
              name="type_1"
              control={control}
              rules={{
                required: "المسمى الوظيفي مطلوب",
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black"> مدينه الانطلاق </label>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div>
                      <SelectTrigger className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1">
                        <SelectValue placeholder="أختر  القسم" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.type_1?.message}
                  </span>
                </FormItem>
              )}
            />

            <Controller
              name="type_2"
              control={control}
              rules={{
                required: "المسمى الوظيفي مطلوب",
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black"> مدينه الوصول </label>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div>
                      <SelectTrigger className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary focus:outline-none focus:ring-2 focus:ring-primary-1">
                        <SelectValue placeholder="أختر  القسم" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
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
              rules={{
                required: "المسمى الوظيفي مطلوب",
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black"> مدينه الانطلاق </label>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div>
                      <SelectTrigger className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary focus:outline-none focus:ring-2 focus:ring-primary-1">
                        <SelectValue placeholder="أختر  القسم" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.type_3?.message}
                  </span>
                </FormItem>
              )}
            />

            <Controller
              name="type_4"
              control={control}
              rules={{
                required: "المسمى الوظيفي مطلوب",
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black"> مدينه الوصول </label>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div>
                      <SelectTrigger className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary focus:outline-none focus:ring-2 focus:ring-primary-1">
                        <SelectValue placeholder="أختر  القسم" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.type_4?.message}
                  </span>
                </FormItem>
              )}
            />
          </div>

          <Controller
            name="appointment"
            control={control}
            rules={{ required: "تاريخ  مطلوب" }}
            render={({ field }) => (
              <FormItem className="relative w-full text-black">
                <label className="font-semibold text-black"> تاريخ / وقت الرحله</label>
                <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                  {errors.appointment?.message}
                </span>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Controller
              name="type_3"
              control={control}
              rules={{
                required: "المسمى الوظيفي مطلوب",
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black"> نوع الرحله </label>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div>
                      <SelectTrigger className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary focus:outline-none focus:ring-2 focus:ring-primary-1">
                        <SelectValue placeholder="أختر  القسم" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.type_3?.message}
                  </span>
                </FormItem>
              )}
            />

            <Controller
              name="name"
              control={control}
              rules={{
                required: " المحتوي مطلوب",
              }}
              render={({ field }) => (
                <FormItem className="relative w-full ">
                  <label className="font-semibold text-black"> سعر الرحله</label>
                  <Input
                    {...field}
                    className="no-focus  min-h-[42px] bg-white text-black   focus-visible:ring-primary-1 focus:outline-none focus:ring-2 focus:ring-primary-1"
                  />
                  <span className="absolute bottom-[-23px] left-0 block w-full text-sm text-red">
                    {errors.name?.message}
                  </span>
                </FormItem>
              )}
            />
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

            <Button
              onClick={() => navigate("/journeys")}
              className=" bg-red hover:bg-red"
            >
              {/* <span>
                    <Spinner className={"text-white"} />
                  </span> */}
              <span> الغاء </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormAddJourney;

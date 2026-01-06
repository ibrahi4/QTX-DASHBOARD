import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/mode-toggle";
import { AiFillBell } from "react-icons/ai";
import { CiGlobe } from "react-icons/ci";
import ChangeLang from "@/components/changeLanguage";
import { useTranslation } from "react-i18next";
import CustomerSideTrigger from "@/components/customSideTrigger";

function RootLayout() {
  // For Search
  const { i18n, t } = useTranslation();
  const [searchValue, setSearch] = useState("");
  const { pathname } = useLocation();

  return (
    <div className="bg-[#F9F9F9] dark:bg-gray-800 rtl:font-neo ltr:font-dm">
      <SidebarProvider>
        <SidebarInset>
          <header className="container flex items-center h-16 gap-4 shrink-0">
            <div className="flex items-center gap-4 px-6 py-2 bg-white rounded-full dark:bg-gray-900">
              <div className="flex items-center gap-4 ">
                <DropdownMenu>
                  <div className="flex items-center gap-4">
                    <DropdownMenuTrigger className="flex items-center gap-2 focus-visible:outline-none">
                      <>
                        <div className="flex items-center gap-2">
                          <IoIosArrowDown />
                          <h4>أحمد ياسر </h4>
                          <Avatar className="rounded-md ">
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              className="rounded-full"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>
                      </>
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                    <div className="p-4  lg:hidden  w-[300px] flex  justify-between items-center">
                      <ModeToggle />
                      <div>
                        <Select>
                          <SelectTrigger className="w-[100px] rounded-full bg-[#F9F9F9] dark:dark:bg-gray-800 dark:!border-gray-700">
                            <SelectValue
                              placeholder="السليمانية"
                              className="dark:text-white"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="القاهره">القاهره</SelectItem>
                            <SelectItem value="الاسكندريه">الاسكندريه</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <CiGlobe className="size-[18px] text-[#888888] dark:text-white" />
                        <span className="capitalize text-[#888888] dark:text-white">
                          english
                        </span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <ChangeLang />

              <div className="flex items-center gap-4 ">
                <div className="relative cursor-pointer">
                  <AiFillBell size={24} className="text-[#888888] dark:text-white" />
                  <div className="absolute top-[2px] right-[2px]  size-[8px] bg-red outline-1 outline outline-white rounded-full flex items-center justify-center "></div>
                </div>

                <div className="hidden lg:block">
                  <ModeToggle />
                </div>

                <div className="relative flex items-center ">
                  <Input
                    value={searchValue}
                    onChange={(e) => {
                      setSearch(e.target?.value);
                    }}
                    type="text"
                    className="min-h-[28px]  dark:bg-gray-800 placeholder:dark:text-gray-400  border max-xl:placeholder:text-sm rounded-full placeholder:text-[#717171] bg-[#F9F9F9] py-2 ps-4 pe-8 lg:pl-8 focus:outline-none focus:ring-1 focus:ring-bg-main  max-sm:max-w-full xl:w-[350px]"
                    placeholder="بحث"
                  />
                  <CiSearch
                    size={22}
                    className="absolute left-2 lg:left-4 text-[#888888] dark:text-white"
                  />
                </div>

                <div className="hidden lg:block">
                  <Select>
                    <SelectTrigger className="w-[100px] rounded-full bg-[#F9F9F9] dark:dark:bg-gray-800 dark:!border-gray-700">
                      <SelectValue
                        placeholder="السليمانية"
                        className="dark:text-white"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="القاهره">القاهره</SelectItem>
                      <SelectItem value="الاسكندريه">الاسكندريه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="ml-auto ">
              <h2 className=" !ml-auto text-[#222222] font-medium text-2xl dark:text-white">
                {t(pathname.split("/").pop() || "/")}
              </h2>
            </div>
            <CustomerSideTrigger />
          </header>

          <div
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            className="flex flex-col flex-1 gap-4"
          >
            <Outlet />
          </div>
        </SidebarInset>
        <AppSidebar
          side={i18n.language === "ar" ? "right" : "left"}
          className=" dark:bg-gray-900"
        />
      </SidebarProvider>
    </div>
  );
}

export default RootLayout;

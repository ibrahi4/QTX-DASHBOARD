import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import ChangeLang from "@/components/changeLanguage";
import { useTranslation } from "react-i18next";
import CustomerSideTrigger from "@/components/customSideTrigger";

function RootLayout() {
  const { i18n, t } = useTranslation();
  const [searchValue, setSearch] = useState("");
  const { pathname } = useLocation();

  return (
    <div className="bg-[#F9F9F9] dark:bg-gray-800 rtl:font-neo ltr:font-dm min-h-screen">
      <SidebarProvider>
        <SidebarInset>
          {/* HEADER */}
          <header className="container h-auto py-3 md:h-16 shrink-0">
            {/* ===== MOBILE HEADER ===== */}
            <div className="flex items-center justify-between gap-2 lg:hidden bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl">
              {/* Sidebar Button */}
              <CustomerSideTrigger />

              {/* Page Title */}
              <h2 className="flex-1 text-center text-[#222222] font-medium text-base dark:text-white truncate">
                {t(pathname.split("/").pop() || "/")}
              </h2>

              {/* Language + Theme */}
              <div className="flex items-center gap-2">
                <ChangeLang />
                <ModeToggle />
              </div>
            </div>

            {/* ===== DESKTOP HEADER ===== */}
            <div className="hidden lg:flex items-center h-16 px-9">
              <div className="flex items-center w-full justify-between bg-white dark:bg-gray-900 px-6 py-2 rounded-3xl">
                {/* LEFT: Title + Sidebar (direction based on language) */}
                <div
                  className={`flex items-center gap-8  ${
                    i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <CustomerSideTrigger />

                  <h2 className="text-[#222222] font-medium text-xl dark:text-white whitespace-nowrap">
                    {t(pathname.split("/").pop() || "/")}
                  </h2>
                </div>

                {/* CENTER: Search */}
                <div className="relative flex items-center w-[250px] xl:w-[350px] mx-6">
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="min-h-[36px] dark:bg-gray-800 border rounded-full bg-[#F9F9F9] py-2 ps-10 pe-4"
                    placeholder="بحث"
                  />
                  <CiSearch className="absolute left-3 text-[#888888] dark:text-white" />
                </div>

                {/* RIGHT: Lang + Theme */}
                <div className="flex items-center gap-8">
                  <ChangeLang />
                  <ModeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div
            style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
            className="flex flex-col flex-1 gap-4 px-4 md:px-6"
          >
            <Outlet />
          </div>
        </SidebarInset>

        <AppSidebar
          side={i18n.language === "ar" ? "right" : "left"}
          className="dark:bg-gray-900"
        />
      </SidebarProvider>
    </div>
  );
}

export default RootLayout;

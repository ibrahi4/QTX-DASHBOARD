import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { IoMap } from "react-icons/io5";

import { Link, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import { FaTicketAlt } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import logo from "../../public/assets/logo.png";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const data = {
    navMain: [
      {
        title: t("dashboard"),
        url: "/",
        icon: <MdSpaceDashboard size={22} />,
      },
      {
        title: t("journeysManagement"),
        url: "/journeys",
        icon: <FaCar size={20} />,
      },
      {
        title: t("heat-map"),
        url: "/heat-map",
        icon: <IoMap size={20} />,
      },
      {
        title: t("usersManagement"),
        name: "users",
        icon: <FaUsers size={20} />,
        subItems: [
          { title: t("passengers"), url: "/users/passengers" },
          { title: t("drivers"), url: "/users/drivers" },
        ],
      },
      {
        title: t("paymentsAndWallets"),
        url: "/payments",
        icon: <FaWallet size={18} />,
      },
      {
        title: t("discountCodes"),
        url: "/discount-codes",
        icon: <FaTicketAlt size={18} />,
      },
      {
        title: t("supportAndComplaints"),
        url: "/supports",
        icon: <MdSupportAgent size={18} />,
      },
      {
        title: t("reportsAndAnalytics"),
        url: "/reports",
        icon: <HiOutlineChartBar size={18} />,
      },
      {
        title: t("settings"),
        name: "settings",
        icon: <IoMdSettings size={18} />,
        subItems: [
          { title: t("systemSettings"), url: "/settings" },
          { title: t("cities"), url: "/settings/cities" },
          { title: t("ads"), url: "/settings/add-ad" },
        ],
      },
    ],
  };
  return (
    <Sidebar {...props}>
      <SidebarContent dir={i18n.dir()} className="w-64 p-4 bg-white dark:bg-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center mt-6 mb-12">
            <img src={logo} alt="Logo" className="h-12" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
              {data.navMain.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <Collapsible className="group/collapsible">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`flex items-center text-sm !text-[#888888] dark:!text-white  justify-between gap-3 rounded-md !p-2 text-gray-2 hover:dark:!bg-gray-800 hover:!text-primary-1 hover:bg-bg-active font-medium ${
                              pathname.startsWith("/" + item.name)
                                ? "!text-primary-1 dark:!bg-gray-800 bg-bg-active "
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown className="h-5 w-5 text-[#888888] transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link
                                    to={subItem.url}
                                    className={`text-base py-2  rounded ${
                                      pathname === subItem.url
                                        ? "!text-primary-1 text-sm dark:!bg-gray-800 bg-bg-active "
                                        : "text-[#888888] dark:text-white hover:!text-primary-1 hover:dark:!bg-gray-800 hover:bg-bg-active "
                                    }`}
                                  >
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        className="flex items-center  gap-3 rounded-md p-2 hover:dark:!bg-gray-800 hover:!text-primary-1 hover:bg-bg-active"
                        asChild
                      >
                        <Link
                          to={item.url}
                          className={`flex items-center gap-3 font-medium text-sm dark:text-white text-[#888888] p-2 rounded ${
                            isActive
                              ? "!text-primary-1 bg-bg-active dark:!bg-gray-800"
                              : "text-gray-2 hover:!text-primary-1 hover:bg-bg-active"
                          }`}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { useForm } from "react-hook-form";

import DateInput from "@/components/ui/dateInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  getAllRides,
  acceptJourney,
  rejectJourney,
} from "@/services/adminService";

const LastedJourneys = () => {
  const { t } = useTranslation();

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // فلاتر محلية (بحث + حالة + تاريخ)
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const { control } = useForm();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllRides(); // جلب كل الرحلات أو الأحدث
        const data = res.data?.rides || res.data || [];

        const mapped = data.map((ride) => ({
          id: ride._id,
          img: ride.driver?.profileImg || "/assets/driver.png",
          name: ride.driver?.fullName || t("notAssigned"),
          cost: ride.fare ? `${ride.fare} ر.س` : "-",
          date: ride.createdAt
            ? new Date(ride.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "-",
          status: ride.status || "pending",
          departure: ride.departure || "-",
          dropoff: ride.dropoffLocation?.address || "-",
          distance: ride.distance || 0,
          duration: ride.duration || 0,
        }));

        setJourneys(mapped);
      } catch (err) {
        console.error("Failed to load journeys:", err);
        setError(t("failedToLoad") || "فشل تحميل الرحلات");
        toast.error(t("failedToLoad") || "فشل تحميل الرحلات");
        setJourneys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [t]);

  // قبول الرحلة
  const handleAccept = async (journeyId) => {
    try {
      await acceptJourney(journeyId);
      toast.success(t("journeyAccepted") || "تم قبول الرحلة بنجاح");

      // تحديث الحالة محليًا
      setJourneys((prev) =>
        prev.map((j) => (j.id === journeyId ? { ...j, status: "accepted" } : j))
      );
    } catch (err) {
      toast.error(t("acceptFailed") || "فشل في قبول الرحلة");
    }
  };

  // رفض الرحلة
  const handleReject = async (journeyId) => {
    try {
      await rejectJourney(journeyId);
      toast.success(t("journeyRejected") || "تم رفض الرحلة بنجاح");

      // تحديث الحالة محليًا
      setJourneys((prev) =>
        prev.map((j) => (j.id === journeyId ? { ...j, status: "rejected" } : j))
      );
    } catch (err) {
      toast.error(t("rejectFailed") || "فشل في رفض الرحلة");
    }
  };

  // فلترة الرحلات (بحث + حالة + تاريخ)
  const filteredJourneys = journeys.filter((j) => {
    const matchesSearch =
      searchValue === "" ||
      j.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      j.cost?.includes(searchValue) ||
      j.departure?.toLowerCase().includes(searchValue.toLowerCase()) ||
      j.dropoff?.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = selectedStatus === "" || j.status === selectedStatus;

    const matchesDate =
      !selectedDate ||
      j.date ===
        new Date(selectedDate).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    return matchesSearch && matchesStatus && matchesDate;
  });

  const headData = [
    t("drivers"),
    t("journeyCost"),
    t("date"),
    t("journeyStatus"),
    t("actions"),
  ];

  return (
    <div className="h-full p-4">
      <div>
        <form className="flex flex-wrap items-center gap-8 md:flex-nowrap">
          <h2 className="font-medium text-[#111111] mb-2 dark:text-white">
            {t("latestJourneys")}
          </h2>
          <div className="flex flex-wrap flex-1 gap-8 sm:flex-nowrap">
            <div className="relative flex items-center flex-1">
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                placeholder={t("searchForJourney")}
              />
              <CiSearch
                size={20}
                className="absolute right-2 text-[#888888] dark:text-white"
              />
            </div>

            <div className="relative flex items-center">
              <DateInput
                value={selectedDate}
                onChange={setSelectedDate}
                className="px-[28px] min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black dark:text-white py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                placeholder={t("date")}
              />
            </div>

            <div className="relative flex items-center">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="rounded-[5px] dark:text-white bg-[#F9F9F9] dark:bg-gray-800">
                  <SelectValue placeholder={t("journeyStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="accepted">{t("accepted")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <div className="overflow-hidden mt-6">
          <ArabicTable headData={headData}>
            {loading ? (
              <Loading type="table" status={true} td={headData.length} tr={8} />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={headData.length}
                  className="text-center text-red-500 py-10"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredJourneys.length > 0 ? (
              filteredJourneys.map((item) => (
                <TableRow
                  key={item.id}
                  className="text-center border-none hover:dark:bg-gray-800"
                >
                  <TableCell className="flex items-center justify-center gap-2 font-medium">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {item.name}
                  </TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-8 py-2 rounded-lg font-medium ${
                        item.status === "accepted" ||
                        item.status === "completed"
                          ? "bg-[#E6F4EF] text-[#11A849]"
                          : item.status === "rejected" ||
                            item.status === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status === "accepted"
                        ? t("accepted")
                        : item.status === "rejected"
                        ? t("rejected")
                        : item.status === "completed"
                        ? t("completed")
                        : item.status === "cancelled"
                        ? t("cancelled")
                        : t("pending")}
                    </span>
                  </TableCell>

                  <TableCell>
                    {item.status === "pending" && (
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          size="sm"
                          className="bg-[#11A849] hover:bg-green-700 text-white"
                          onClick={() => handleAccept(item.id)}
                        >
                          {t("accept")}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(item.id)}
                        >
                          {t("reject")}
                        </Button>
                      </div>
                    )}
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
  );
};

export default LastedJourneys;

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { Controller, useForm } from "react-hook-form";
import { FormItem } from "@/components/ui/form";
import DateInput from "@/components/ui/dateInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getLatestJourneys } from "@/services/adminService";

const LastedJourneys = () => {
  const { t } = useTranslation();

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { control } = useForm();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        const res = await getLatestJourneys(); // استدعاء الـ API
        const data = res.data?.journeys || res.data || res || [];
        console.log("Fetched latest journeys:", data);

        const mappedJourneys = data.map((item) => ({
          id: item._id || item.id,
          img: item.driver?.profileImg || "/assets/driver.png",
          name: item.driver?.fullName || t("notSpecified"),
          cost: item.fare ? `${item.fare} ر.س` : "-",
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("ar-EG")
            : "-",
          status: item.status || "pending",
        }));

        setJourneys(mappedJourneys);
      } catch (err) {
        console.error("Failed to load latest journeys:", err);
        setError(t("failedToLoad") || "Failed to load latest journeys");
        toast.error(t("failedToLoad") || "Failed to load latest journeys");
        setJourneys([]); // لا بيانات استاتيكية
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [t]);

  const headData = [
    t("drivers"),
    t("journeyCost"),
    t("date"),
    t("journeyStatus"),
  ];

  return (
    <div className="h-full p-4">
      <div>
        <form className="flex flex-wrap items-center gap-8 md:flex-nowrap">
          <h2 className="font-medium text-[#111111] mb-2 dark:text-white">
            {t("latestJourneys")}
          </h2>
          <div className="flex flex-wrap flex-1 gap-8 sm:flex-nowrap">
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <FormItem className="relative flex items-center flex-1">
                  <Input
                    {...field}
                    className="px-[28px] dark:bg-gray-800 dark:text-white placeholder:dark:text-gray-400 min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                    placeholder={t("searchForJourney")}
                  />
                  <CiSearch
                    size={20}
                    className="absolute right-2 !m-0 text-[#888888] dark:text-white"
                  />
                </FormItem>
              )}
            />

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <FormItem className="relative flex items-center">
                  <DateInput
                    value={field.value || null}
                    onChange={field.onChange}
                    className="px-[28px] min-h-[40px] rounded-full border-none bg-[#F9F9F9] text-black dark:text-white py-2 focus:outline-none focus:ring-1 focus:ring-primary-1 placeholder:text-[#888888]"
                    placeholder={t("date")}
                  />
                </FormItem>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormItem className="relative flex items-center">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-[5px] dark:text-white bg-[#F9F9F9] dark:bg-gray-800">
                      <SelectValue placeholder={t("journeyStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepted">{t("accepted")}</SelectItem>
                      <SelectItem value="rejected">{t("rejected")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </form>

        <div className="overflow-hidden">
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
            ) : journeys.length > 0 ? (
              journeys.map((item) => (
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
                      className={`bg-[#E6F4EF] px-8 py-2 text-[#11A849] rounded-lg font-medium ${
                        item.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : ""
                      }`}
                    >
                      {item.status === "accepted"
                        ? t("accepted")
                        : item.status === "rejected"
                        ? t("rejected")
                        : t("pending")}
                    </span>
                  </TableCell>

                  <TableCell>
                    {/* Actions column left empty as in original */}
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

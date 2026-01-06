import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-hot-toast";
import Loading from "@/components/feedback/Loading";
import { getCancelAndWaitStats } from "@/services/adminService";

const COLORS = ["#EC373B", "#007AFF", "#EFF4FB"]; // أحمر: إلغاء، أزرق: انتظار، رمادي: باقي

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm bg-white rounded shadow dark:bg-gray-800">
        <p>{`${payload[0].name} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const OffJourney = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [cancelRate, setCancelRate] = useState(0);
  const [waitRate, setWaitRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getCancelAndWaitStats(); // استدعاء الـ API
        const data = res.data || {};
        console.log("Fetched cancel & wait stats:", data);

        // افتراض: الـ API يرجع نسب مئوية أو أرقام نحولها لنسبة
        let cancel = data.cancelRate || data.cancelledPercentage || 0;
        let wait =
          data.waitRate || data.avgWaitingPercentage || data.waitingRate || 0;

        // لو الـ API رجع أرقام خام (مثل عدد الرحلات الملغاة / الكلية)، نحسب النسبة
        if (data.totalTrips && data.cancelledTrips) {
          cancel = Math.round((data.cancelledTrips / data.totalTrips) * 100);
        }
        if (data.totalTrips && data.waitingTrips) {
          wait = Math.round((data.waitingTrips / data.totalTrips) * 100);
        }

        setCancelRate(Math.round(cancel));
        setWaitRate(Math.round(wait));
      } catch (err) {
        console.error("Failed to load cancel & wait stats:", err);
        toast.error(t("failedToLoad") || "Failed to load statistics");

        // fallback للقيم الأصلية لو الـ API فشل
        setCancelRate(12);
        setWaitRate(78);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  const remainingValue = Math.max(0, 100 - (cancelRate + waitRate));

  const data = [
    { name: t("cancelRate"), value: cancelRate },
    { name: t("avgWaitingTime"), value: waitRate },
    { name: "باقي الدائرة", value: remainingValue },
  ];

  if (loading) {
    return (
      <div className="p-8 h-[400px] bg-white dark:bg-gray-900 rounded-[20px] shadow-main flex items-center justify-center">
        <Loading type="spinner" />
      </div>
    );
  }

  return (
    <div className="p-8 h-[400px] bg-white dark:bg-gray-900 rounded-[20px] shadow-main">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
        <span className="text-[#3872FA] font-bold">{t("cancelRate")}</span>
        <Select>
          <SelectTrigger className="w-[100px] rounded-full border-0 shadow-none dark:text-white">
            <SelectValue placeholder={t("monthly")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">{t("weekly")}</SelectItem>
            <SelectItem value="monthly">{t("monthly")}</SelectItem>
            <SelectItem value="yearly">{t("yearly")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height="60%" className="relative">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            stroke={theme === "dark" ? "#1f2937" : "#F9F9F9"}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <section className="flex items-center justify-between px-2 mt-2 shadow-main rtl:w-[70%] ltr:w-[100%] mx-auto py-5 rounded-[15px] gap-4">
        <div className="px-5 rtl:border-l ltr:border-r border-[#88888880]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC373B]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("cancelRate")}
            </span>
          </div>
          <p className="text-[#EC373B] font-bold text-center text-lg">
            {cancelRate}%
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("avgWaitingTime")}
            </span>
          </div>
          <p className="text-[#007AFF] font-bold text-center text-lg">
            {waitRate}%
          </p>
        </div>
      </section>
    </div>
  );
};

export default OffJourney;

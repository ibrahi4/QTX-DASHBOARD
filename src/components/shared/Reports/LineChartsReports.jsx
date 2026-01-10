import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import icon from "../../../../public/assets/Home/icon-green.png";
import quick from "../../../../public/assets/Home/quickmark.png";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { getRevenueAnalysis } from "@/services/adminService";

const LineChartsReports = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getRevenueAnalysis();
        const apiData = res.data || [];

        let total = 0;

        // تحويل البيانات من الـ API إلى شكل مناسب للـ Line Chart
        const formattedData = apiData.map((item) => {
          // حماية من undefined في _id أو sub-fields
          const day = item._id?.day || 1;
          const month = item._id?.month || 1;
          const year = item._id?.year || new Date().getFullYear();

          const dateObj = new Date(year, month - 1, day); // month هو 1-based

          const formattedName = dateObj.toLocaleDateString("ar-EG", {
            day: "numeric",
            month: "long",
          });

          const revenueValue =
            item.revenue || item.totalRevenue || item.amount || 0;
          total += revenueValue;

          return {
            name: formattedName,
            revenue: revenueValue,
          };
        });

        // ترتيب حسب التاريخ من الأقدم للأحدث
        formattedData.sort((a, b) => {
          const dateA = new Date(
            a.name.replace(
              / \w+/,
              `/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
            )
          );
          const dateB = new Date(
            b.name.replace(
              / \w+/,
              `/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
            )
          );
          return dateA - dateB;
        });

        setChartData(formattedData);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Failed to load revenue data:", err);
        setError(t("failedToLoad") || "Failed to load revenue data");
        toast.error(t("failedToLoad") || "Failed to load revenue data");

        // fallback إلى بيانات استاتيكية في حالة الفشل
        setChartData([
          { name: "سبتمبر", revenue: 140000 },
          { name: "أكتوبر", revenue: 130000 },
          { name: "نوفمبر", revenue: 100000 },
          { name: "ديسمبر", revenue: 120000 },
          { name: "يناير", revenue: 210000 },
          { name: "فبراير", revenue: 240000 },
        ]);
        setTotalRevenue(940000);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [t]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-3 py-2 text-sm text-white bg-blue-500 rounded-md shadow-lg">
          {`${payload[0].value.toLocaleString()} ${t("currency") || "ر.س"}`}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-8 bg-white h-full rounded-[20px] shadow-main dark:bg-gray-900 flex items-center justify-center">
        <Loading type="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white h-full rounded-[20px] shadow-main dark:bg-gray-900 flex flex-col items-center justify-center">
        <LottieHandler type="error" message={error} />
        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="p-8 bg-white h-full rounded-[20px] shadow-main dark:bg-gray-900"
      style={{ minWidth: "400px" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-[#3872FA] text-3xl font-bold">
            {t("revenueAnalysis")}
          </h2>
          <p className="text-[#A3ED0] flex items-center gap-2 mt-2">
            {t("totalRevenueThisPeriod") || "إجمالي الإيرادات في هذه الفترة"}
            <span className="text-[#11A849] font-bold">
              {totalRevenue.toLocaleString()} {t("currency") || "ر.س"}
            </span>
            <img src={icon} alt="growth" className="w-5 h-5" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <p className="text-[#11A849]">{t("onTrack")}</p>
            <img src={quick} alt="quick" className="w-3 h-3" />
          </div>
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-300">
          {t("thisMonth")}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 12,
              fill: theme === "dark" ? "#ffffff" : "#212121",
            }}
            interval={0}
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 6, fill: "#3b82f6" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartsReports;

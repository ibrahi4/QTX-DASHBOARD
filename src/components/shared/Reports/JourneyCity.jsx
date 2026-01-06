import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import Loading from "@/components/feedback/Loading";
import { getTripsByCity } from "@/services/adminService";

const JourneyCity = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripsByCity = async () => {
      try {
        setLoading(true);
        const res = await getTripsByCity(); // استدعاء الـ API
        const apiData = res.data || [];
        console.log("Fetched trips by city:", apiData);
        // تحويل البيانات من الـ backend إلى شكل مناسب للـ Bar Chart
        const formattedData = apiData.map((item) => ({
          name: item.city || item.name || t("unknownCity"),
          pv: item.count || item.trips || item.total || 0,
        }));

        // ترتيب تنازلي حسب عدد الرحلات (اختياري لتحسين العرض)
        formattedData.sort((a, b) => b.pv - a.pv);

        setChartData(formattedData);
      } catch (err) {
        console.error("Failed to load trips by city:", err);
        toast.error(t("failedToLoad") || "Failed to load trips by city");

        // fallback إلى بيانات فارغة (مش استاتيكية قديمة)
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTripsByCity();
  }, [t]);

  if (loading) {
    return (
      <div className="p-8 h-80 bg-white rounded-[20px] shadow-main dark:bg-gray-900 flex items-center justify-center">
        <Loading type="spinner" />
      </div>
    );
  }

  return (
    <div className="p-8 h-80 bg-white rounded-[20px] shadow-main dark:bg-gray-900">
      <h2 className="font-medium mb-4 text-base text-[#3872FA]">
        {t("tripsByCity")}
      </h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007AFF" stopOpacity={1} />
                <stop offset="100%" stopColor="#007AFF26" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: theme === "dark" ? "#ffffff" : "#212121",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide={true} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                borderColor: theme === "dark" ? "#111827" : "#fff",
              }}
              cursor={{ fill: theme === "dark" ? "#1f2937" : "#F9F9F9" }}
            />
            <Bar
              dataKey="pv"
              stackId="a"
              fill="url(#barGradient)"
              barSize={20}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[80%] text-gray-500 dark:text-gray-400">
          {t("noData") || "لا توجد رحلات حسب المدن حاليًا"}
        </div>
      )}
    </div>
  );
};

export default JourneyCity;

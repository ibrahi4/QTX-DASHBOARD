import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import { getTripTypesStats } from "@/services/adminService";

const COLORS = ["#EE9919CC", "#007AFF"]; // VIP: برتقالي شفاف، Normal: أزرق

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm bg-white rounded shadow dark:bg-gray-800">
        <p>{`${payload[0].name ?? ""} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

const BieCartsReport = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [vipPercentage, setVipPercentage] = useState(0);
  const [normalPercentage, setNormalPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripTypes = async () => {
      try {
        setLoading(true);
        const res = await getTripTypesStats(); // استدعاء الـ API
        const data = res.data || {};
        console.log("Fetched trip types stats:", data);
        // افتراض: الـ API يرجع عدد أو نسب مئوية للرحلات VIP و Normal
        let vip = data.vipPercentage || data.vipTripsPercentage || 0;
        let normal = data.normalPercentage || data.normalTripsPercentage || 0;

        // لو رجع أرقام خام (عدد الرحلات)
        if (data.totalTrips && (data.vipTrips || data.vipCount)) {
          const vipCount = data.vipTrips || data.vipCount || 0;
          vip = Math.round((vipCount / data.totalTrips) * 100);
          normal = 100 - vip;
        }

        setVipPercentage(Math.round(vip));
        setNormalPercentage(Math.round(normal));
      } catch (err) {
        console.error("Failed to load trip types stats:", err);
        toast.error(
          t("failedToLoad") || "Failed to load trip types statistics"
        );

        // fallback للقيم الأصلية لو الـ API فشل
        setVipPercentage(12);
        setNormalPercentage(78);
      } finally {
        setLoading(false);
      }
    };

    fetchTripTypes();
  }, [t]);

  const data = [
    { name: t("vipTrips"), value: vipPercentage },
    { name: t("normalTrips"), value: normalPercentage },
  ];

  if (loading) {
    return (
      <div className="p-8 h-[400px] bg-white rounded-[20px] shadow-main dark:bg-gray-900 flex items-center justify-center">
        <Loading type="spinner" />
      </div>
    );
  }

  return (
    <div className="p-8 h-[400px] bg-white rounded-[20px] shadow-main dark:bg-gray-900">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
        <span className="text-[#3872FA] font-bold">{t("tripTypes")}</span>
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

      <section className="flex items-center justify-between px-2 mt-2 shadow-main rtl:w-[70%] mx-auto py-5 rounded-[15px] gap-4">
        <div className="px-5 ltr:border-r rtl:border-l border-[#88888880]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("normalTrips")}
            </span>
          </div>
          <p className="text-[#007AFF] font-bold text-center text-lg">
            {normalPercentage}%
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EE9919CC]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("vipTrips")}
            </span>
          </div>
          <p className="text-[#EE9919CC] font-bold text-center text-lg">
            {vipPercentage}%
          </p>
        </div>
      </section>
    </div>
  );
};

export default BieCartsReport;

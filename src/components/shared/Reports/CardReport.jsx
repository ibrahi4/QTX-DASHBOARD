import { useState, useEffect } from "react";
import icon from "../../../../public/assets/Home/icon-card.png";
import driving from "../../../../public/assets/Home/driving.png";
import icon_red from "../../../../public/assets/Home/icon-red.png";
import dolar from "../../../../public/assets/Home/dolar.png";
import icon_green from "../../../../public/assets/report-icon-green.png";
import smart_car from "../../../../public/assets/smart-car.png";
import clients from "../../../../public/assets/clients.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import Loading from "@/components/feedback/Loading";
import { getReportStats } from "@/services/adminService";

const CardReport = () => {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalRevenueAlt: 0,
    revenueChange: 0,
    avgTripTime: 0,
    customerSatisfaction: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getReportStats(); // استدعاء الـ API
        const data = res.data || {};
        console.log("Fetched report stats:", data);
        setStats({
          totalRevenue: data.totalRevenue || data.revenue || 0,
          totalRevenueAlt:
            data.totalRevenueAlt || data.grossRevenue || data.netRevenue || 0,
          revenueChange: data.revenueChange || data.revenueGrowth || 0,
          avgTripTime: data.avgTripTime || data.averageDuration || 0,
          customerSatisfaction:
            data.customerRating ||
            data.satisfactionScore ||
            data.avgRating ||
            0,
        });
      } catch (err) {
        console.error("Failed to load report stats:", err);
        toast.error(t("failedToLoad") || "Failed to load report statistics");

        // fallback للقيم الأصلية لو الـ API فشل
        setStats({
          totalRevenue: 8500,
          totalRevenueAlt: 232356,
          revenueChange: 5,
          avgTripTime: 20,
          customerSatisfaction: 4.7,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[20px] shadow-main dark:bg-gray-900 min-h-[180px] flex items-center justify-center"
          >
            <Loading type="spinner" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 - Total Revenue (الإيرادات اليومية/الشهرية) */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={driving} alt="driving" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("totalRevenue")}
              </p>
              <h2 className="text-3xl text-[#11A849] font-medium">
                {stats.totalRevenue.toLocaleString()}
              </h2>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon} alt="icon" />
            </div>
          </div>
        </div>

        {/* Card 2 - Total Revenue Alt (إجمالي الإيرادات مع التغيير) */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={dolar} alt="dolar" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("totalRevenueAlt")}
              </p>
              <h2 className="text-3xl text-[#717171] dark:text-gray-400 font-medium">
                {stats.totalRevenueAlt.toLocaleString()}
              </h2>
              <p className="text-sm text-[#777777] dark:text-gray-200">
                <span
                  className={`font-medium ${
                    stats.revenueChange >= 0 ? "text-[#11A849]" : "text-red-600"
                  }`}
                >
                  {stats.revenueChange >= 0 ? "+" : ""}
                  {stats.revenueChange}%
                </span>{" "}
                {t("comparisonToPrevious")}
              </p>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon_green} alt="icon" />
            </div>
          </div>
        </div>

        {/* Card 3 - Average Trip Time */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={smart_car} alt="smart car" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("avgTripTime")}
              </p>
              <h2 className="text-2xl text-[#717171] dark:text-gray-400 font-medium">
                {stats.avgTripTime} {t("minute")}
              </h2>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon_red} alt="icon" />
            </div>
          </div>
        </div>

        {/* Card 4 - Customer Satisfaction */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-2 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={clients} alt="clients" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("customerSatisfaction")}
              </p>
              <h2 className="text-3xl text-[#717171] dark:text-gray-400 font-medium">
                {stats.customerSatisfaction.toFixed(1)} / 5
              </h2>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon} alt="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardReport;

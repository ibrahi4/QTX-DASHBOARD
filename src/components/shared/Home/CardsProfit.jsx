import { useState, useEffect } from "react";
import face from "../../../../public/assets/Home/face.png";
import icon from "../../../../public/assets/Home/icon-card.png";
import business from "../../../../public/assets/Home/business.png";
import driving from "../../../../public/assets/Home/driving.png";
import icon_red from "../../../../public/assets/Home/icon-red.png";
import vote from "../../../../public/assets/Home/votes.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getDashboardStats } from "@/services/adminService";

const CardsProfit = () => {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    driversCount: 0,
    journeysCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats(); // استدعاء الـ API
        const data = res.data || {};
        console.log("Fetched dashboard stats:", data);

        setStats({
          totalRevenue: data.totalRevenue || data.revenue || 0,
          driversCount: data.totalDrivers || data.drivers || 0,
          journeysCount: data.completedRides || data.rides || data.trips || 0,
          usersCount:
            data.totalPassengers || data.passengers || data.users || 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        toast.error(t("failedToLoad") || "Failed to load statistics");

        // لو الـ API فشل → تبقى الأرقام 0 (بدون قيم استاتيكية قديمة)
        setStats({
          totalRevenue: 0,
          driversCount: 0,
          journeysCount: 0,
          usersCount: 0,
        });
      }
    };

    fetchStats();
  }, [t]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Revenue */}
        <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-main">
          <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
            <img src={face} alt="face" />
          </div>

          <div>
            <p className="text-base text-[#777777] dark:text-white mb-2">
              {t("totalRevenue")}
            </p>
            <h2 className="text-3xl text-[#11A849] font-medium">
              ${stats.totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="absolute bottom-4 left-4">
            <img src={icon} alt="icon" />
          </div>
        </div>

        {/* Drivers Count */}
        <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-main">
          <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
            <img src={business} alt="face" />
          </div>

          <div>
            <p className="text-base text-[#777777] dark:text-white mb-2">
              {t("driversCount")}
            </p>
            <h2 className="text-3xl font-medium text-primary-1">
              {stats.driversCount.toLocaleString()}
            </h2>
          </div>

          <div className="absolute bottom-4 left-4">
            <img src={icon} alt="icon" />
          </div>
        </div>

        {/* Journeys Count */}
        <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-main">
          <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
            <img src={driving} alt="face" />
          </div>

          <div>
            <p className="text-base text-[#777777] dark:text-white mb-2">
              {t("journeysCount")}
            </p>
            <h2 className="text-3xl font-medium text-primary-1">
              {stats.journeysCount.toLocaleString()}
            </h2>
          </div>

          <div className="absolute bottom-4 left-4">
            <img src={icon_red} alt="icon" />
          </div>
        </div>

        {/* Users Count */}
        <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-main">
          <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
            <img src={vote} alt="face" />
          </div>

          <div>
            <p className="text-base text-[#777777] dark:text-white mb-2">
              {t("usersCount")}
            </p>
            <h2 className="text-3xl font-medium text-primary-1">
              {stats.usersCount.toLocaleString()}
            </h2>
          </div>

          <div className="absolute bottom-4 left-4">
            <img src={icon} alt="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsProfit;

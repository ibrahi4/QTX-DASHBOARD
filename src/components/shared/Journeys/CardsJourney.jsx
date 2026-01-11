import { useState, useEffect } from "react";
import icon from "../../../../public/assets/Home/icon-card.png";
import car1 from "../../../../public/assets/Journeys/carblue.png";
import car2 from "../../../../public/assets/Journeys/caroragne.png";
import car3 from "../../../../public/assets/Journeys/cargreen.png";
import car4 from "../../../../public/assets/Journeys/carred.png";
import icon_orange from "../../../../public/assets/Journeys/icon-orange.png";
import icon_green from "../../../../public/assets/Journeys/icon-green.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getRidesStats } from "@/services/adminService";

const CardsJourney = () => {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    reception: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getRidesStats(); // /admin/stats/rides
        const data = res.data || {};
        console.log("Fetched journey stats:", data);
        setStats({
          reception: data.pending || 0,
          inProgress: data.started || 0,
          completed: data.completed || 0,
          cancelled: data.cancelled || 0,
        });
      } catch (err) {
        console.error("Failed to load rides stats:", err);
        toast.error(t("failedToLoad") || "Failed to load journey stats");

        // لو الـ API فشل → تبقى الأرقام 0 بدل القيم الاستاتيكية القديمة
        setStats({
          reception: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
        });
      }
    };

    fetchStats();
  }, [t]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl">
        <div className="p-4 rounded-full bg-[#F9F9F9]">
          <img src={car1} alt="face" />
        </div>

        <div>
          <p className="text-base text-[#777777] dark:text-white mb-2">
            {t("reception")}
          </p>
          <h2 className="text-3xl font-medium text-primary-1">
            {" "}
            {stats.reception} {t("journey")}
          </h2>
        </div>

        <div className="absolute bottom-4 left-4">
          <img src={icon} alt="icon" />
        </div>
      </div>

      <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl">
        <div className="p-4 rounded-full bg-[#F9F9F9]">
          <img src={car2} alt="face" />
        </div>

        <div>
          <p className="text-base text-[#777777] dark:text-white mb-2">
            {t("inProgress")}
          </p>
          <h2 className="text-3xl font-medium text-orange">
            {" "}
            {stats.inProgress} {t("journey")}
          </h2>
        </div>

        <div className="absolute bottom-4 left-4">
          <img src={icon_orange} alt="icon" />
        </div>
      </div>

      <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl">
        <div className="p-4 rounded-full bg-[#F9F9F9]">
          <img src={car3} alt="face" />
        </div>

        <div>
          <p className="text-base text-[#777777] dark:text-white mb-2">
            {t("completed")}
          </p>
          <h2 className="text-3xl font-medium text-green">
            {" "}
            {stats.completed} {t("journey")}{" "}
          </h2>
        </div>

        <div className="absolute bottom-4 left-4">
          <img src={icon_green} alt="icon" />
        </div>
      </div>

      <div className="relative flex items-center gap-8 p-8 bg-white dark:bg-gray-900 rounded-xl">
        <div className="p-4 rounded-full bg-[#F9F9F9]">
          <img src={car4} alt="face" />
        </div>

        <div>
          <p className="text-base text-[#777777] dark:text-white mb-2">
            {t("cancelled")}
          </p>
          <h2 className="text-3xl font-medium text-primary-1">
            {" "}
            {stats.cancelled} {t("journey")}
          </h2>
        </div>

        <div className="absolute bottom-4 left-4">
          <img src={icon} alt="icon" />
        </div>
      </div>
    </div>
  );
};

export default CardsJourney;

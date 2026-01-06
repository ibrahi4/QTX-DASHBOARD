import icon from "../../../../public/assets/Home/icon-card.png";
import driving from "../../../../public/assets/Home/driving.png";
import icon_red from "../../../../public/assets/Home/icon-red.png";
import dolar from "../../../../public/assets/Home/dolar.png";
import icon_green from "../../../../public/assets/report-icon-green.png";
import smart_car from "../../../../public/assets/smart-car.png";
import clients from "../../../../public/assets/clients.png";
import { useTranslation } from "react-i18next";
const CardReport = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={driving} alt="face" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("totalRevenue")}
              </p>
              <h2 className="text-3xl text-[#11A849] font-medium">8,500</h2>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon} alt="icon" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={dolar} alt="face" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("totalRevenueAlt")}
              </p>
              <h2 className="text-3xl text-[#717171] dark:text-gray-400  font-medium">
                232,356
              </h2>
              <p className="text-sm text-[#777777] dark:text-gray-200 ">
                <span className="text-[#11A849]">5%</span> {t("comparisonToPrevious")}
              </p>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon_green} alt="icon" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-4 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={smart_car} alt="face" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2 dark:text-white">
                {t("avgTripTime")}
              </p>
              <h2 className="text-3xl text-[#717171] dark:text-gray-400  font-medium">
                20دقيقه
              </h2>
            </div>
            <div className="absolute bottom-4 left-4">
              <img src={icon_red} alt="icon" />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div>
          <div className="bg-white p-8 rounded-[20px] shadow-main relative flex items-center gap-8 min-h-[180px] dark:bg-gray-900">
            <div className="p-2 rounded-full bg-[#F9F9F9] dark:bg-gray-800">
              <img src={clients} alt="face" />
            </div>
            <div>
              <p className="text-base text-[#777777] mb-2  dark:text-white">
                {t("customerSatisfaction")}
              </p>
              <h2 className="text-3xl text-[#717171]  dark:text-gray-400 font-medium">
                4.7 / 5
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

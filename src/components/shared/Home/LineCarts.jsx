import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import icon from "../../../../public/assets/Home/icon-green.png";
import quick from "../../../../public/assets/Home/quickmark.png";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
const data = [
  { name: "SEP", trips: 140 },
  { name: "OCT", trips: 130 },
  { name: "NOV", trips: 200 },
  { name: "DEC", trips: 120 },
  { name: "JAN", trips: 210 },
  { name: "FEB", trips: 240 },
];

// Create a lower line (offset downward)

const LineCarts = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md shadow">
          {`${payload[0].value} ${t("journey")}`}
        </div>
      );
    }

    return null;
  };
  return (
    <div className="p-8 h-80 " style={{ minWidth: "400px" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-[#3872FA] text-3xl font-bold">240 {t("journey")}</h2>
          <p className="dark:text-white text-[#A3AED0] flex items-center gap-2">
            <span>{t("totalJourneys")}</span>
            <span className="text-[#11A849] font-bold"> +4.25% </span>{" "}
            <img src={icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm text-green-600">
            <p className="text-[#11A849]">{t("onTrack")}</p>
            <img src={quick} alt="" />
          </div>
        </div>
        <div className="text-sm text-gray-400 dark:text-white">{t("thisMonth")}</div>
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <LineChart data={data}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: theme === "dark" ? "#ffffff" : "#212121" }}
            interval={0}
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="trips"
            stroke="#3b82f6"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          {/* <Line
                        type="monotone"
                        data={shadowData}
                        dataKey="trips"
                        stroke="#007AFF26"
                        strokeWidth={2}
                        dot={false}
                    /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineCarts;

import { useTheme } from "@/components/theme-provider";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
const COLORS = ["#EE9919CC", "#007AFF"];

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
  payload: PropTypes.arrayOf(PropTypes.object),
};

const BieCartsReport = () => {
  const cancelValue = 12;
  const waitValue = 78;
  const { t } = useTranslation();
  const data = [
    { name: t("vipTrips"), value: cancelValue },
    { name: t("normalTrips"), value: waitValue },
  ];
  const { theme } = useTheme();

  return (
    <div className="p-8 h-[400px]  bg-white rounded-[20px] shadow-main  dark:bg-gray-900">
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

      <ResponsiveContainer width="100%" height={"60%"} className="relative">
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#3872FA]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("normalTrips")}
            </span>
          </div>
          <p className="text-[#3872FA] font-bold text-center text-lg">
            {waitValue}%
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
            {cancelValue}%
          </p>
        </div>
      </section>
    </div>
  );
};

export default BieCartsReport;

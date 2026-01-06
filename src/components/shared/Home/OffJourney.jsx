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

const COLORS = ["#EC373B", "#007AFF26", "#EFF4FB"];

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
  const cancelValue = 12;
  const waitValue = 78;
  const remainingValue = Math.max(0, 100 - (cancelValue + waitValue));
  const { theme } = useTheme();
  const { t } = useTranslation();
  const data = [
    { name: t("cancelRate"), value: cancelValue },
    { name: t("avgWaitingTime"), value: waitValue },
    { name: "باقي الدائرة", value: remainingValue },
  ];

  return (
    <div className="p-8   h-[400px]">
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
      <section className="flex items-center justify-between px-2 mt-2 shadow-main rtl:w-[70%] ltr:w-[100%] mx-auto py-5 rounded-[15px] gap-4">
        <div className="px-5 rtl:border-l ltr:border-r border-[#88888880]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC373B]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("cancelRate")}
            </span>
          </div>
          <p className="text-[#EC373B] font-bold text-center text-lg">
            {cancelValue}%
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3872FA]"></span>
            <span className="text-sm font-medium dark:text-white text-[#888888]">
              {t("avgWaitingTime")}
            </span>
          </div>
          <p className="text-[#3872FA] font-bold text-center text-lg">
            {waitValue}%
          </p>
        </div>
      </section>
    </div>
  );
};

export default OffJourney;

import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: " أربيل", pv: 240 },
  { name: "دهوك", pv: 1200 },
  { name: "السليمانية", pv: 980 },
  { name: "دهوك", pv: 390 },
  { name: "أربيل", pv: 480 },
  { name: "السليمانية", pv: 380 },
  { name: "18", pv: 430 },
];
const JourneyCity = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <div className="p-8  h-80 bg-white rounded-[20px] shadow-main dark:bg-gray-900">
      <h2 className="font-medium mb-4 text-base  text-[#3872FA]">{t("tripsByCity")}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
          // barCategoryGap={}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#007AFF" stopOpacity={1} />
              <stop offset="100%" stopColor="#007AFF26" stopOpacity={1} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: theme === "dark" ? "#ffffff" : "#212121" }}
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
          {/* <Bar dataKey="uv" stackId="a" fill="#cce5ff"  barSize={20} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JourneyCity;

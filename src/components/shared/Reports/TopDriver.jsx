import { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import ArabicTable from "@/components/ArabicTable";
import Loading from "@/components/feedback/Loading";
import LottieHandler from "@/components/feedback/lottieHandler/LottieHandler";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getTopDrivers } from "@/services/adminService";

const TopDriver = () => {
  const { t } = useTranslation();

  const [topDrivers, setTopDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headData = [t("drivers"), t("journeyCost"), t("rating"), t("earnings")];

  useEffect(() => {
    const fetchTopDrivers = async () => {
      try {
        setLoading(true);
        const res = await getTopDrivers(); // API call to get top drivers
        const driversData = res.data || res || [];

        // Map backend data to required format
        const mappedDrivers = driversData.map((driver) => ({
          id: driver._id || driver.id,
          img: driver.profileImg || "/assets/driver.png",
          name: driver.fullName || "Not specified",
          cost: driver.earnings.today ? `${driver.earnings.today} ر.س` : "-",
          rate: driver.rating?.toFixed(1) || "0.0",
          status: driver.earnings.today ? `${driver.earnings.today} ر.س` : "-",
        }));

        setTopDrivers(mappedDrivers.slice(0, 4)); // Show only top 4
      } catch (err) {
        console.error("Failed to load top drivers:", err);
        setError(t("failedToLoad") || "Failed to load top drivers");
        toast.error(t("failedToLoad") || "Failed to load top drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchTopDrivers();
  }, [t]);

  return (
    <div className="p-8 h-80 bg-white rounded-[20px] shadow-main dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="text-[#717171] dark:text-white">{t("topDrivers")}</div>
        <div className="text-[#717171] dark:text-white cursor-pointer hover:text-primary-1 transition"></div>
      </div>

      <div className="mt-6">
        <ArabicTable headData={headData}>
          {loading ? (
            <Loading type="table" status={true} td={headData.length} tr={4} />
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={headData.length}
                className="text-center text-red-500 py-10"
              >
                {error}
              </TableCell>
            </TableRow>
          ) : topDrivers.length > 0 ? (
            <>
              {topDrivers.map((item) => (
                <TableRow
                  key={item.id}
                  className="text-center border-none hover:dark:bg-gray-800"
                >
                  <TableCell className="flex items-center justify-center gap-2 font-medium">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {item.name}
                  </TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={headData.length}>
                <LottieHandler type="empty" message={t("noData")} />
              </TableCell>
            </TableRow>
          )}
        </ArabicTable>
      </div>
    </div>
  );
};

export default TopDriver;

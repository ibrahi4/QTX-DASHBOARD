import BieCartsReport from "@/components/shared/Reports/BieCartsReport";
import CardReport from "@/components/shared/Reports/CardReport";
import JourneyCity from "@/components/shared/Reports/JourneyCity";
import LineChartsReports from "@/components/shared/Reports/LineChartsReports";
import TopDriver from "@/components/shared/Reports/TopDriver";

const Reports = () => {
  return (
    <div className="container py-8 space-y-8">
      <CardReport />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartsReports />
        </div>
        <div className="col-span-1">
          <BieCartsReport />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <JourneyCity />
        </div>
        <div>
          <TopDriver />
        </div>
      </div>
    </div>
  );
};

export default Reports;

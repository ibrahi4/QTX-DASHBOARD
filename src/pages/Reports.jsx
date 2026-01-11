// import BieCartsReport from "@/components/shared/Reports/BieCartsReport";
import CardReport from "@/components/shared/Reports/CardReport";
import LineChartsReports from "@/components/shared/Reports/LineChartsReports";
import TopDriver from "@/components/shared/Reports/TopDriver";

const Reports = () => {
  return (
    <div className="container py-8 space-y-8">
      <CardReport />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <LineChartsReports />
        </div>
        <div className="lg:col-span-2">
          <TopDriver />
        </div>
      </div>
    </div>
  );
};

export default Reports;

import CardsProfit from "@/components/shared/Home/CardsProfit";
import LastedJourneys from "@/components/shared/Home/LastedJourneys";
import LineCarts from "@/components/shared/Home/LineCarts";
import OffJourney from "@/components/shared/Home/OffJourney";
import StatictCarts from "@/components/shared/Home/StatictCarts";

function Home() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-6 rounded-3xl">
      {/* Cards Profit - Full width */}
      <CardsProfit />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 w-full">
        <div className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 shadow-main min-h-[280px] md:min-h-[360px]">
          <StatictCarts />
        </div>

        {/* OffJourney */}
        <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 shadow-main min-h-[360px] md:min-h-[420px]">
          <OffJourney />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-1 w-full">
        <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 shadow-main min-h-[280px] md:min-h-[360px]">
          <LineCarts />
        </div>
        {/* LastedJourneys */}
        <div className="lg:col-span-1 w-full h-full rounded-2xl bg-white dark:bg-gray-900 shadow-main min-h-[360px] md:min-h-[420px]">
          <LastedJourneys />
        </div>
      </div>
    </div>
  );
}

export default Home;

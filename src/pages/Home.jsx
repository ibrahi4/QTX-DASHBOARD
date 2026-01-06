import CardsProfit from "@/components/shared/Home/CardsProfit";
import LastedJourneys from "@/components/shared/Home/LastedJourneys";
import LineCarts from "@/components/shared/Home/LineCarts";
import OffJourney from "@/components/shared/Home/OffJourney";
import StatictCarts from "@/components/shared/Home/StatictCarts";

function Home() {
  return (
    <div className="container py-8 space-y-8">
      <CardsProfit />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="rounded-[20px] bg-white dark:bg-gray-900 shadow-main">
          <StatictCarts />
        </div>
        <div className="rounded-[20px] bg-white dark:bg-gray-900 shadow-main">
          <LineCarts />
        </div>
      </div>
      <div className="flex flex-wrap gap-8 xl:flex-nowrap">
        <div className="rounded-[20px] max-w-[100%] bg-white shadow-main dark:bg-gray-900 flex-1">
          <LastedJourneys />
        </div>
        <div className="rounded-[20px] w-full xl:w-auto xl:min-w-[500px] bg-white dark:bg-gray-900 shadow-main ">
          <OffJourney />
        </div>
      </div>
    </div>
  );
}

export default Home;

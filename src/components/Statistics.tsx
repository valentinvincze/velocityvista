import weeklyCalc from "@/lib/utils/weeklyCalc";
import type { Sales } from "@/types";
import StatCard from "./card/StatCard";
import { GoDotFill } from "react-icons/go";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import clsx from "clsx";

export default function Statistics({
  sales,
  lastSales,
}: {
  sales: Sales;
  lastSales: Sales;
}) {
  const totalSales = sales?.length ?? 0;

  const lastTotalSales = lastSales?.length ?? 0;

  const currentMonthTotal = totalSales - lastTotalSales;

  const { currentWeekSecured, lastWeekSecured, currentWeekLost, lastWeekLost } =
    weeklyCalc(sales);

  const currentWeekSecuredRate = currentWeekSecured - lastWeekSecured;

  const currentWeekLostRate = currentWeekLost - lastWeekLost;

  const securedRateStyle = (currentRate: number, lastRate: number) => {
    const style = clsx({
      "text-red-700": currentRate < lastRate,
      "text-emerald-700": currentRate > lastRate,
    });

    const icon =
      currentRate < lastRate ? (
        <HiArrowTrendingDown className="w-5 h-5" />
      ) : (
        <HiArrowTrendingUp className="w-5 h-5" />
      );

    return { icon, style };
  };

  const lostRateStyle = (currentRate: number, lastRate: number) => {
    const style = clsx({
      "text-emerald-700": currentRate < lastRate,
      "text-red-700": currentRate > lastRate,
    });

    const icon =
      currentRate > lastRate ? (
        <HiArrowTrendingDown className="w-5 h-5" />
      ) : (
        <HiArrowTrendingUp className="w-5 h-5" />
      );

    return { icon, style };
  };

  const totalRateStyle = {
    style: "text-cyan-700",
    icon:
      totalSales < lastTotalSales ? (
        <HiArrowTrendingDown className="w-5 h-5" />
      ) : (
        <HiArrowTrendingUp className="w-5 h-5" />
      ),
  };

  return (
    <>
      <StatCard
        title="Secured"
        icon={<GoDotFill className="w-6 h-6 text-emerald-700" />}
        saleCount={currentWeekSecured}
        rateStyle={securedRateStyle(currentWeekSecured, lastWeekSecured)}
        currentRate={currentWeekSecured}
        lastRate={lastWeekSecured}
        overallRate={currentWeekSecuredRate}
        when="week"
      />
      <StatCard
        title="Lost"
        icon={<GoDotFill className="w-6 h-6 text-red-700" />}
        saleCount={currentWeekLost}
        rateStyle={lostRateStyle(currentWeekLost, lastWeekLost)}
        currentRate={currentWeekLost}
        lastRate={lastWeekLost}
        overallRate={currentWeekLostRate}
        when="week"
      />
      <StatCard
        title="Total Deals"
        icon={<GoDotFill className="w-6 h-6 text-cyan-700" />}
        saleCount={totalSales}
        rateStyle={totalRateStyle}
        currentRate={totalSales}
        lastRate={lastTotalSales}
        overallRate={currentMonthTotal}
        when="month"
      />
    </>
  );
}

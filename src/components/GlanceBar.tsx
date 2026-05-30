import weeklyCalc from "@/lib/utils/weeklyCalc";
import type { Sales } from "@/types";
import clsx from "clsx";

export default function GlanceBar({ sales }: { sales: Sales }) {
  const { currentWeekSecured, currentWeekTotal, currentWeekLost } =
    weeklyCalc(sales);

  const securedPct =
    Math.round((currentWeekSecured / currentWeekTotal) * 100) || 0;

  const secured = sales?.length && currentWeekSecured !== 0;

  const lost = sales?.length && currentWeekLost !== 0;

  const securedBarStyle = clsx({
    "bg-gray-400 dark:bg-neutral-600": !secured,
    "bg-emerald-600 dark:bg-emerald-800": secured,
  });

  const lostBarStyle = clsx({
    "bg-gray-400 dark:bg-neutral-600": !lost,
    "bg-red-600 dark:bg-red-800": lost,
  });

  return (
    <div className="row-start-3 col-span-full bg-card border border-gray-200 rounded-3xl flex gap-4 items-center p-8 dark:border-neutral-700">
      <p className="text-label uppercase">This week</p>
      <div
        className={`h-3 flex-1 rounded-full opacity-20 dark:opacity-40 ${lostBarStyle}`}
      >
        <div
          className={`h-full rounded-full ${securedBarStyle}`}
          style={{ width: `${securedPct}%` }}
        />
      </div>
      <span className="text-emerald-700 text-lg">
        {currentWeekSecured} secured
      </span>
      <span className="text-red-700 text-lg">{currentWeekLost} lost</span>
    </div>
  );
}

import weeklyCalc from "@/lib/utils/weeklyCalc";
import type { Sales } from "@/types";
import clsx from "clsx";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

function Ring({ pct }: { pct: number }) {
  const radius = 60;
  const size = 152;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--color-inner-stroke)"
        strokeWidth="8"
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--color-outer-stroke)"
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy + 10}
        fontSize="26"
        fontWeight="600"
        fill="var(--color-inner-text)"
        textAnchor="middle"
        fontFamily="system-ui"
      >
        {pct}%
      </text>
    </svg>
  );
}

export default function PerformanceCard({ sales }: { sales: Sales }) {
  const securedSales =
    sales?.filter((sale) => sale.status === "secured").length ?? 0;

  const totalSales = sales?.length ?? 0;

  const performanceScore = Math.round((securedSales / totalSales) * 100) || 0;

  const {
    currentWeekSecured,
    currentWeekTotal,
    lastWeekSecured,
    lastWeekTotal,
  } = weeklyCalc(sales);

  const currentWeekRate =
    Math.round((currentWeekSecured / currentWeekTotal) * 100) || 0;

  const lastWeekRate = Math.round((lastWeekSecured / lastWeekTotal) * 100) || 0;

  const overallRate = currentWeekRate - lastWeekRate;

  const rateStyle = clsx({
    "text-red-700": currentWeekRate < lastWeekRate,
    "text-emerald-700": currentWeekRate > lastWeekRate,
  });

  const rateIcon =
    currentWeekRate < lastWeekRate ? (
      <HiArrowTrendingDown className="w-5 h-5" />
    ) : (
      <HiArrowTrendingUp className="w-5 h-5" />
    );

  return (
    <div className="row-start-1 col-span-2 row-span-2 bg-performance-card rounded-3xl py-8">
      <div className="flex justify-evenly gap-8 items-center">
        <div className="flex flex-col justify-center gap-10">
          <h4 className="uppercase font-medium text-neutral-600 dark:text-neutral-500">
            Performance score
          </h4>
          <p className="text-white text-7xl dark:text-black">
            {performanceScore}
            <span className="text-neutral-500 dark:text-neutral-700 text-4xl">
              %
            </span>
          </p>
          <div className={`flex gap-1 items-center text-sm ${rateStyle}`}>
            {currentWeekRate === lastWeekRate || currentWeekRate === 0 ? (
              <p className="text-label">No change in performance this week!</p>
            ) : (
              <>
                {rateIcon}
                <p>
                  <span>{currentWeekRate < lastWeekRate ? "" : "+"}</span>
                  {overallRate}% this week
                </p>
              </>
            )}
          </div>
        </div>
        <Ring pct={performanceScore} />
      </div>
    </div>
  );
}

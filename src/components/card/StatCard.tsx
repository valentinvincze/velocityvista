import type { StatCardProps } from "@/types";

export default function StatCard({
  title,
  icon,
  saleCount,
  rateStyle,
  currentRate,
  lastRate,
  overallRate,
  when,
}: StatCardProps) {
  return (
    <div className="row-start-1 row-span-2 border border-gray-200 rounded-3xl bg-card dark:border-neutral-700 p-8 flex flex-col justify-center gap-10">
      <div className="flex justify-between">
        <h4 className="uppercase text-label">{title}</h4>
        {icon}
      </div>
      <span className="text-7xl">{saleCount}</span>
      <div className={`flex gap-1 items-center text-sm ${rateStyle.style}`}>
        {currentRate === lastRate ? (
          <p className="text-label">Same amount as last {when}!</p>
        ) : currentRate === 0 ? (
          <p className="text-label">No logged sales this {when}!</p>
        ) : (
          <>
            {rateStyle.icon}
            <p>
              <span>{currentRate < lastRate ? "" : "+"}</span>
              {overallRate} this {when}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

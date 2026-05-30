import { Sales } from "@/types";
import weeklyCalc from "@/lib/utils/weeklyCalc";
import clsx from "clsx";

export default function RecentActivity({ sales }: { sales: Sales }) {
  const sortedSales =
    sales !== null
      ? [...sales].sort(
          (a, b) =>
            new Date(b.closing_date).getDate() -
            new Date(a.closing_date).getDate(),
        )
      : [];

  const format = (num: number) => {
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
    return `$${num}`;
  };

  const recentActElement = sortedSales?.map((sale) => {
    const closing_date = new Date(sale.closing_date).toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric" },
    );

    const secured = sale.status === "secured";

    const statusStyle = clsx({
      "bg-emerald-700/20 text-emerald-700 w-[85px]": secured,
      "bg-red-700/20 text-red-700 w-[55px]": !secured,
    });

    const statusText = `${sale.status.charAt(0).toUpperCase()}${sale.status.slice(1)}`;

    return (
      <div key={sale.id}>
        <div className="flex items-center gap-6">
          <span
            className={`p-1 rounded-3xl text-center text-sm ${statusStyle}`}
          >
            {statusText}
          </span>
          <div className="text-label">
            <div>
              <p>{sale.title}</p>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {closing_date}
              </span>
            </div>
          </div>
          <span className="ml-auto text-label dark:text-white font-medium">
            {format(sale.amount)}
          </span>
        </div>
        <hr className="mt-2 border-gray-200 dark:border-neutral-700" />
      </div>
    );
  });

  const { currentWeekSecured, currentWeekLost } = weeklyCalc(sales);

  const totalValue = sales?.reduce((sum, row) => sum + row.amount, 0) ?? 0;

  return (
    <div className="col-start-4 col-span-full row-start-4 row-span-full border border-gray-200 rounded-3xl bg-card p-8 dark:border-neutral-700">
      <h4 className="text-lg mb-4 text-label">Recent Activity</h4>
      <div className="flex flex-col gap-4 h-[276px] overflow-y-auto no-scrollbar scroll-smooth">
        {recentActElement}
      </div>
      <p className="mt-5 text-[.8rem] text-label">
        This week you closed{" "}
        <span className="font-bold text-emerald-700">
          {currentWeekSecured} {currentWeekSecured === 1 ? "deal" : "deals"}
        </span>{" "}
        and lost{" "}
        <span className="font-semibold text-red-700">
          {currentWeekLost} {currentWeekLost === 1 ? "deal" : "deals"}
        </span>
        . Total value logged:{" "}
        <span className="font-bold dark:text-white">{`$${totalValue?.toLocaleString()}`}</span>
        .
      </p>
    </div>
  );
}

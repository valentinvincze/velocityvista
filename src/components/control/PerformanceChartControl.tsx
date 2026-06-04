"use client";

import { useState } from "react";
import clsx from "clsx";
import { Sales } from "@/types";
import weeklyCalc from "@/lib/utils/weeklyCalc";
import PLChart from "../chart/PerformanceLineChart";

export default function PerformanceChartControl({
  sales,
  lastSales,
}: {
  sales: Sales;
  lastSales: Sales;
}) {
  const [defaultDisplay, setDisplay] = useState("weekly");

  const focusStyle = clsx(
    "bg-white",
    "text-black",
    "dark:bg-neutral-800",
    "dark:text-white",
  );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const { currentWeekPerformance, lastWeekPerformance } = weeklyCalc(sales);

  const currentWeekDay = currentWeekPerformance?.map((sale) =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
    }).format(new Date(sale.closing_date)),
  );

  const lastWeekDay = lastWeekPerformance?.map((sale) =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
    }).format(new Date(sale.closing_date)),
  );

  const weeklyEntries = days.map((day) => {
    return {
      label: day.slice(0, 3),
      currentDayCount: currentWeekDay?.filter((cd) => cd === day).length || 0,
      lastDayCount: lastWeekDay?.filter((ld) => ld === day).length || 0,
    };
  });

  const currentDayDate = sales?.map((sale) =>
    new Date(sale.closing_date).getDate(),
  );

  const lastDayDate = lastSales?.map((sale) =>
    new Date(sale.closing_date).getDate(),
  );

  const dayFilter = (
    dayDate: number[],
    lowerBound: number,
    upperBound: number,
  ) => {
    return dayDate.filter((day) => day > lowerBound && day < upperBound).length;
  };

  const currentWeek1 = dayFilter(currentDayDate ?? [], 0, 8);

  const currentWeek2 = dayFilter(currentDayDate ?? [], 7, 15);

  const currentWeek3 = dayFilter(currentDayDate ?? [], 14, 22);

  const currentWeek4 = dayFilter(currentDayDate ?? [], 21, 32);

  const lastWeek1 = dayFilter(lastDayDate ?? [], 0, 8);

  const lastWeek2 = dayFilter(lastDayDate ?? [], 7, 15);

  const lastWeek3 = dayFilter(lastDayDate ?? [], 14, 22);

  const lastWeek4 = dayFilter(lastDayDate ?? [], 21, 32);

  const monthlyEntries = [
    {
      label: "Week 1",
      currentDayCount: currentWeek1,
      lastDayCount: lastWeek1,
    },
    {
      label: "Week 2",
      currentDayCount: currentWeek2,
      lastDayCount: lastWeek2,
    },
    {
      label: "Week 3",
      currentDayCount: currentWeek3,
      lastDayCount: lastWeek3,
    },
    {
      label: "Week 4",
      currentDayCount: currentWeek4,
      lastDayCount: lastWeek4,
    },
  ];

  return (
    <div className="row-start-4 row-span-full col-span-3 bg-card border border-gray-200 rounded-3xl p-8 dark:border-neutral-700 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h4 className="text-label text-lg">Performance</h4>
          <div className="flex items-center gap-2">
            <hr className="w-[15px] border border-chart-line" />
            {defaultDisplay === "weekly" ? (
              <span className="text-sm text-label">This week</span>
            ) : (
              <span className="text-sm text-label">This month</span>
            )}
            <hr className="w-[15px] border border-chart-line-muted ml-4" />
            {defaultDisplay === "weekly" ? (
              <span className="text-sm text-label">Last week</span>
            ) : (
              <span className="text-sm text-label">Last month</span>
            )}
          </div>
        </div>
        <div className="bg-gray-100 p-1 rounded-lg dark:bg-neutral-700">
          <button
            onClick={() => setDisplay("weekly")}
            className={`px-3 py-1 rounded-md ${defaultDisplay === "weekly" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setDisplay("monthly")}
            className={`px-3 py-1 rounded-md ${defaultDisplay === "monthly" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
          >
            Monthly
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {defaultDisplay === "weekly" ? (
          <PLChart entries={weeklyEntries} />
        ) : (
          <PLChart entries={monthlyEntries} />
        )}
      </div>
    </div>
  );
}

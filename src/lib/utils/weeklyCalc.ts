import { Sales } from "@/types";

export default function weeklyCalc(sales: Sales) {
  const date = new Date().getTime();
  const today = new Date().getDay();

  const mondayOffset = today === 0 ? today - 6 : today - (today - 1);

  const mondayRef = new Date();

  // roll back to Monday
  mondayRef.setDate(mondayRef.getDate() - (today - mondayOffset));

  // set to midnight
  mondayRef.setHours(0, 0, 0, 0);

  // timestamps
  const currentWeek = mondayRef.getTime();
  const lastWeek = currentWeek - 604800000;

  const lastWeekPerformance = sales?.filter(
    (sale) =>
      lastWeek < Date.parse(sale.closing_date) &&
      Date.parse(sale.closing_date) < currentWeek,
  );

  const currentWeekPerformance = sales?.filter(
    (sale) =>
      currentWeek < Date.parse(sale.closing_date) &&
      Date.parse(sale.closing_date) < date,
  );

  let currentWeekSecured = 0;
  let currentWeekTotal = 0;
  let currentWeekLost = 0;

  let lastWeekSecured = 0;
  let lastWeekTotal = 0;
  let lastWeekLost = 0;

  if (lastWeekPerformance && currentWeekPerformance) {
    currentWeekSecured = currentWeekPerformance.filter(
      (sale) => sale.status === "secured",
    ).length;

    currentWeekTotal = currentWeekPerformance.length;

    currentWeekLost = currentWeekTotal - currentWeekSecured;

    lastWeekSecured = lastWeekPerformance.filter(
      (sale) => sale.status === "secured",
    ).length;

    lastWeekTotal = lastWeekPerformance.length;

    lastWeekLost = lastWeekTotal - lastWeekSecured;
  }

  return {
    currentWeekPerformance,
    currentWeekSecured,
    currentWeekTotal,
    currentWeekLost,
    lastWeekPerformance,
    lastWeekSecured,
    lastWeekTotal,
    lastWeekLost,
  };
}

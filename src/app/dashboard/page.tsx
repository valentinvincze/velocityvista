import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PerformanceCard from "@/components/card/PerformanceCard";
import Statistics from "@/components/Statistics";
import GlanceBar from "@/components/GlanceBar";
import RecentActivity from "@/components/card/RecentActivityCard";
import PerformanceChartControl from "@/components/control/PerformanceChartControl";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    lastDayOfLastMonth.getMonth(),
    1,
  );

  const { data: sales } = await supabase
    .from("sales")
    .select("id, amount, title, status, closing_date")
    .eq("rep_id", user!.id)
    .gte("closing_date", firstDayOfMonth.toISOString().split("T")[0])
    .order("created_at", { ascending: false });

  const { data: lastSales } = await supabase
    .from("sales")
    .select("amount, title, status, closing_date")
    .eq("rep_id", user!.id)
    .gte("closing_date", firstDayOfLastMonth.toISOString().split("T")[0])
    .lte("closing_date", lastDayOfLastMonth.toISOString().split("T")[0]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <section className="grid grid-cols-5 grid-rows-6 gap-4 grow min-h-0 p-8">
        <PerformanceCard sales={sales} />
        <Statistics sales={sales} lastSales={lastSales} />
        <GlanceBar sales={sales} />
        <RecentActivity sales={sales} />
        <PerformanceChartControl sales={sales} lastSales={lastSales} />
      </section>
    </div>
  );
}

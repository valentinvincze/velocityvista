import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { userData } from "@/types";
import ToggleThemeBtn from "@/components/ToggleThemeBtn";
import Avatar from "@/components/Avatar";
import LogSaleModal from "@/components/modal/LogSaleModal";
import PerformanceCard from "@/components/card/PerformanceCard";
import Statistics from "@/components/Statistics";
import GlanceBar from "@/components/GlanceBar";
import RecentActivity from "@/components/card/RecentActivityCard";
import PerformanceChart from "@/components/chart/PerformanceChart";

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

  let userData: userData;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, job_title")
      .eq("id", user!.id)
      .single();

    if (error) throw error;

    userData = data;
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }

  const parts = userData?.full_name?.split(" ") ?? [];
  const firstName = parts[0];
  const avatarInitials =
    parts.length > 1
      ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
      : "";

  const currentDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  return (
    <div className="h-full flex flex-col">
      <header className="py-4 px-10 border-b border-b-gray-200 h-[78px] flex justify-between items-center dark:border-b-neutral-800">
        <div>
          <h3 className="text-2xl font-medium">{`Welcome back, ${firstName}!`}</h3>
          <span className="text-neutral-400 text-sm font-light dark:text-neutral-500">
            {currentDate}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <ToggleThemeBtn padding="p-2" />
          <div className="w-px h-5 bg-gray-200 dark:bg-neutral-800" />
          <LogSaleModal
            trigger={
              <button className="bg-black text-white text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black">
                + Log Sale
              </button>
            }
          />
          <Avatar initials={avatarInitials} />
        </div>
      </header>
      <section className="grid grid-cols-5 grid-rows-6 gap-4 grow min-h-0 p-8">
        <PerformanceCard sales={sales} />
        <Statistics sales={sales} lastSales={lastSales} />
        <GlanceBar sales={sales} />
        <RecentActivity sales={sales} />
        <PerformanceChart sales={sales} lastSales={lastSales} />
      </section>
    </div>
  );
}

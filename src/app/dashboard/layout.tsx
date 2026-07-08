import Navbar from "@/components/navigation/Navbar";
import Avatar from "@/components/Avatar";
import { createClient } from "@/lib/supabase/server";
import type { userData } from "@/types";
import ToggleThemeBtn from "@/components/ToggleThemeBtn";
import LogSaleModal from "@/components/modal/LogSaleModal";
import CreateDivisionModal from "@/components/modal/CreateDivisionModal";
import SendTokenModal from "@/components/modal/SendTokenModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user!.app_metadata.role;

  let userData: userData;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, job_title, avatar_url")
      .eq("id", user!.id)
      .single();

    if (error) throw error;

    userData = data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  const parts = userData?.full_name?.split(" ") ?? [];
  const formatted =
    parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : "";
  const avatarInitials =
    parts.length > 1
      ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
      : "";
  const firstName = parts[0];

  const today = new Date();

  const currentDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  const avatar_url = userData?.avatar_url;

  return (
    <main className="h-full w-full flex">
      <aside className="w-72">
        <Navbar
          avatar={<Avatar initials={avatarInitials} avatar_url={avatar_url} />}
          name={formatted}
          jobtitle={userData?.job_title ?? ""}
          role={role}
        />
      </aside>
      <section className="flex-1 flex flex-col min-h-0">
        <header className="py-4 px-8 border-b border-b-gray-200 h-[78px] flex justify-between items-center dark:border-b-neutral-800">
          <div>
            <h3 className="text-2xl font-medium">{`Welcome back, ${firstName}!`}</h3>
            <span className="text-neutral-400 text-sm font-light dark:text-neutral-500">
              {currentDate}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <ToggleThemeBtn padding="p-2" />
            <div className="w-px h-5 bg-gray-200 dark:bg-neutral-800" />
            {role === "rep" ? (
              <LogSaleModal
                trigger={
                  <button className="bg-black text-white text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black">
                    + Log Sale
                  </button>
                }
              />
            ) : (
              role === "coo" && (
                <>
                  <CreateDivisionModal
                    trigger={
                      <button className="text-label border border-gray-200 text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:border-neutral-700">
                        + Create division
                      </button>
                    }
                  />
                  <SendTokenModal
                    trigger={
                      <button className="bg-black text-white text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black">
                        Send token
                      </button>
                    }
                  />
                </>
              )
            )}
            <Avatar avatar_url={avatar_url} initials={avatarInitials} />
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

import Navbar from "@/components/navigation/Navbar";
import Avatar from "@/components/Avatar";
import { createClient } from "@/lib/supabase/server";
import type { userData } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user!.user_metadata.role;

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
    console.error("Error fetching user data:", error);
  }

  const parts = userData?.full_name?.split(" ") ?? [];
  const formatted =
    parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : "";
  const avatarInitials =
    parts.length > 1
      ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
      : "";

  return (
    <main className="h-full w-full flex">
      <aside className="w-72">
        <Navbar
          avatar={<Avatar initials={avatarInitials} />}
          name={formatted}
          jobtitle={userData?.job_title ?? ""}
          role={role}
        />
      </aside>
      <section className="flex-1 min-h-0">{children}</section>
    </main>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeamControl from "@/components/control/TeamControl";

export default async function DashTeamPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const role = user!.user_metadata.role;
  const id = user.id;

  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let profileData;
  let profileError;

  if (role === "coo") {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, job_title, avatar_url, division_id, sales(amount.sum())",
      )
      .eq("sales.status", "secured")
      .gte("sales.closing_date", firstDayOfMonth.toISOString().split("T")[0])
      .eq("role", "rep");

    profileData = data;
    profileError = error;
  }

  let divProfileData;
  let divProfileError;

  if (role === "admin" || role === "rep") {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, job_title, avatar_url, division_id, sales(amount.sum())",
      )
      .eq("sales.status", "secured")
      .gte("sales.closing_date", firstDayOfMonth.toISOString().split("T")[0])
      .eq("division_id", user.user_metadata.division_id)
      .eq("role", "rep");

    divProfileData = data;
    divProfileError = error;
  }

  const { data: divsData, error: divsError } = await supabase
    .from("divisions")
    .select("name, id");

  if (profileError) {
    console.error("Error fetching profiles:", profileError.message);
  }

  if (divProfileError) {
    console.error(
      "Error fetching division specific profiles:",
      divProfileError.message,
    );
  }

  if (divsError) {
    console.error("Error fetching divisions:", divsError.message);
  }

  return (
    <section className="p-8">
      <TeamControl
        divisions={divsData}
        role={role}
        id={id}
        profiles={profileData}
        divProfiles={divProfileData ?? []}
      />
    </section>
  );
}

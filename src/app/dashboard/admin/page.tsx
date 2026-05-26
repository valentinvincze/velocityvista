import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PanelCard from "@/components/card/PanelCard";
import PanelControl from "@/components/PanelControl";

export default async function DashAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const role = user!.user_metadata.role;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, division_id");

  let divProfileData;
  let divProfileError;

  if (role === "admin") {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at, division_id")
      .eq("division_id", user.user_metadata.division_id);

    divProfileData = profileData;
    divProfileError = profileError;
  }

  const { data: divs, error: divisionError } = await supabase
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

  if (divisionError) {
    console.error("Error fetching divisions:", divisionError.message);
  }

  const totalUsersAsCoo = profileData?.length ?? 0;
  const totalUsersAsAdmin = (divProfileData && divProfileData?.length) || 0;

  const totalAdminsAsCoo =
    profileData?.filter((role) => role.role === "admin").length ?? 0;
  const totalAdminsAsAdmin =
    divProfileData?.filter((role) => role.role === "admin").length ?? 0;

  const totalRepsAsCoo =
    profileData?.filter((role) => role.role === "rep").length ?? 0;
  const totalRepsAsAdmin =
    divProfileData?.filter((role) => role.role === "rep").length ?? 0;

  const divisions = divs?.length ?? 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <section className="flex flex-col gap-10 p-8 grow min-h-0">
        <div className="flex gap-4">
          <PanelCard
            title="Total users"
            count={role === "coo" ? totalUsersAsCoo : totalUsersAsAdmin}
          />
          <PanelCard
            title="Admins"
            count={role === "coo" ? totalAdminsAsCoo : totalAdminsAsAdmin}
          />
          <PanelCard
            title="Reps"
            count={role === "coo" ? totalRepsAsCoo : totalRepsAsAdmin}
          />
          {role === "coo" && <PanelCard title="Divisions" count={divisions} />}
        </div>
        <PanelControl
          role={role}
          divisions={divs}
          profiles={profileData}
          divProfiles={divProfileData ?? []}
        />
      </section>
    </div>
  );
}

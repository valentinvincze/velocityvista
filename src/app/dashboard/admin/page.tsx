import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const role = user!.user_metadata.role;

  return (
    <div>{role === "admin" ? <h2>Admin Panel!</h2> : <h2>COO Panel!</h2>}</div>
  );
}

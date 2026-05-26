import SignUpForm from "@/components/form/SignUpForm";
import { createClient } from "@/lib/supabase/server";
import { MdHomeFilled } from "react-icons/md";
import ToggleThemeBtn from "@/components/ToggleThemeBtn";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) redirect("/dashboard");

  let divisions;

  try {
    const { data, error } = await supabase.from("divisions").select("name, id");
    if (error) throw error;
    divisions = data;
  } catch (error) {
    console.error("Error fetching divisions:", error);
  }

  return (
    <section className="w-full max-w-md bg-form border border-gray-200 px-8 py-10 rounded-2xl hover:shadow-xs dark:border-neutral-700">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black rounded-xl p-2 dark:bg-white">
            <MdHomeFilled className="w-7 h-7 fill-svg" />
          </div>
          <div>
            <h1 className="font-medium">Velocity Vista</h1>
            <span className="text-sm text-label">
              Sales intelligence platform
            </span>
          </div>
        </div>
        <ToggleThemeBtn padding="py-2 px-4" />
      </div>
      <hr className="my-7 border-gray-200 dark:border-neutral-700" />
      <SignUpForm options={divisions ?? []} />
    </section>
  );
}

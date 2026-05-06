import SignInForm from "@/components/forms/SignInForm";
import { MdHomeFilled } from "react-icons/md";
import ToggleThemeBtn from "@/components/ToggleThemeBtn";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) redirect("/dashboard");

  return (
    <section className="w-full max-w-md bg-form border border-gray-200 px-8 py-10 rounded-2xl hover:shadow-xs dark:border-neutral-700">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black rounded-xl p-2 dark:bg-white">
            <MdHomeFilled className="w-7 h-7 fill-svg" />
          </div>
          <div>
            <h1 className="text-md font-medium">Velocity Vista</h1>
            <span className="text-sm text-label">
              Sales intelligence platform
            </span>
          </div>
        </div>
        <ToggleThemeBtn padding="py-2 px-4" />
      </div>
      <hr className="my-7 border-gray-200 dark:border-neutral-700" />
      <SignInForm />
    </section>
  );
}

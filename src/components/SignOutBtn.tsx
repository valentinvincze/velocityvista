"use client";

import { signOutUser } from "@/app/auth/signout/action";
import { SignOutBtnProps } from "@/types";

export default function SignOutBtn({ icon }: SignOutBtnProps) {
  return (
    <button
      onClick={() => signOutUser()}
      className="flex gap-2 items-center ml-2 w-full text-neutral-400 text-sm cursor-pointer dark:text-neutral-500"
    >
      {icon}
      Sign Out
    </button>
  );
}

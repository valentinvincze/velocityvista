"use client";

import { RxDashboard } from "react-icons/rx";
import { AiOutlineTeam } from "react-icons/ai";
import { MdLeaderboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { RiSettings5Line } from "react-icons/ri";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import SignOutBtn from "../SignOutBtn";

export default function ActiveNavLinks({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full px-4">
      <div>
        <span className="block uppercase text-xs tracking-widest text-neutral-400 font-semibold ml-2 mt-6 mb-3 dark:text-neutral-500">
          Main
        </span>
        <ul>
          <NavLink
            href={role === "rep" ? "/dashboard" : "/dashboard/admin"}
            isActive={
              role === "rep"
                ? pathname === "/dashboard"
                : pathname === "/dashboard/admin"
            }
            icon={<RxDashboard />}
          >
            {role === "rep" ? "Dashboard" : "Admin Panel"}
          </NavLink>

          <NavLink
            href="/dashboard/team"
            isActive={pathname === "/dashboard/team"}
            icon={<AiOutlineTeam />}
          >
            Team
          </NavLink>

          <NavLink
            href="/dashboard/leaderboard"
            isActive={pathname === "/dashboard/leaderboard"}
            icon={<MdLeaderboard />}
          >
            Leaderboard
          </NavLink>
        </ul>
      </div>
      <div className="flex flex-col gap-2 border-t border-t-gray-200 px-3 py-2 dark:border-t-neutral-800">
        <ul>
          <NavLink
            href="/dashboard/settings"
            isActive={pathname === "/dashboard/settings"}
            icon={<RiSettings5Line />}
          >
            Settings
          </NavLink>
        </ul>

        <SignOutBtn icon={<IoIosLogOut />} />
      </div>
    </div>
  );
}

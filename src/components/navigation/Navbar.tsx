import { HiChartSquareBar } from "react-icons/hi";
import ActiveNavLinks from "./ActiveNavLinks";
import { NavbarProps } from "@/types";

export default function Navbar({ avatar, name, jobtitle, role }: NavbarProps) {
  return (
    <nav className="h-full border border-gray-200 flex flex-col gap-2 dark:border-neutral-800">
      <div className="flex items-center gap-2 border-b border-b-gray-200 p-4 dark:border-b-neutral-800">
        <HiChartSquareBar className="w-11 h-11" />
        <div>
          <h1 className="text-sm font-semibold">Velocity Vista</h1>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            Sales intelligence platform
          </span>
        </div>
      </div>
      <ActiveNavLinks role={role} />
      <div className="flex gap-4 px-4 pb-4 items-center ml-3">
        {avatar}
        <div className="flex flex-col">
          <span className="font-medium text-sm text-label dark:font-normal">
            {name}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {jobtitle}
          </span>
        </div>
      </div>
    </nav>
  );
}

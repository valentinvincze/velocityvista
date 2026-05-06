import Link from "next/link";
import { NavLinkProps } from "@/types";
import clsx from "clsx";

export default function NavLink({
  href,
  children,
  isActive,
  icon,
}: NavLinkProps) {
  return (
    <li className="flex items-center w-full">
      <Link
        href={href}
        className={clsx(
          "flex gap-2 w-full items-center p-2 rounded-md cursor-pointer text-sm",
          {
            "text-white bg-black dark:text-black dark:bg-white": isActive,
            "text-neutral-400 dark:text-neutral-500": !isActive,
          },
        )}
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}

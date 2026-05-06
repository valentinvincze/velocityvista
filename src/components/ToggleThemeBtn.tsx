"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { RiSunFill } from "react-icons/ri";
import { LuMoon } from "react-icons/lu";
import { PiDesktopTowerLight } from "react-icons/pi";

export default function ToggleThemeBtn({ padding }: { padding?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-7 h-7" />;

  const next = {
    dark: "system",
    system: "light",
    light: "dark",
  };

  return (
    <button
      onClick={() => setTheme(next[theme as keyof typeof next])}
      className={`relative border border-gray-200 rounded-xl ${padding} w-7 h-7 flex items-center justify-center transition-all duration-200 hover:bg-gray-100 active:scale-95 cursor-pointer dark:border-neutral-700 dark:hover:bg-neutral-700`}
      aria-label={
        theme === "dark"
          ? "Switch to system mode"
          : theme === "system"
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
    >
      <RiSunFill
        className={`w-4 h-4 text-neutral-500 absolute transition-all duration-300 ${theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
      />
      <LuMoon
        className={`w-4 h-4 text-neutral-500 absolute transition-all duration-300 ${theme === "light" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
      />
      <PiDesktopTowerLight
        className={`w-4 h-4 text-neutral-500 absolute transition-all duration-300 ${theme === "system" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
      />
    </button>
  );
}

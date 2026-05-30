import Link from "next/link";

export default function Avatar({ initials }: { initials: string }) {
  return (
    <Link
      href="/dashboard/settings"
      className="rounded-full bg-svg text-placeholder w-9 h-9 text-xs font-semibold flex items-center justify-center"
    >
      {initials}
    </Link>
  );
}

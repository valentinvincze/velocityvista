import Link from "next/link";

export default function Avatar({ initials }: { initials: string }) {
  return (
    <Link
      href="/dashboard/settings"
      className="rounded-full bg-svg text-placeholder p-2 text-xs font-semibold"
    >
      {initials}
    </Link>
  );
}

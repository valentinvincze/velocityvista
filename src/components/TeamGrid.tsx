import type { TeamGridProps } from "@/types";
import clsx from "clsx";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import TeamCard from "./card/TeamCard";

export default function TeamGrid({
  profiles,
  worstFiveReps,
  userRole,
  isOpen,
  setIsOpen,
}: TeamGridProps) {
  const format = (num: number) => {
    if (num >= 1000) return `$${Math.round(num / 1000)}k`;
    return `$${num}`;
  };

  const rankings = (index: number) => {
    const first = index === 0;
    const second = index === 1;
    const third = index === 2;
    const fourth = index === 3;
    const fifth = index === 4;

    const rankingNumbers =
      (first && "#1") ||
      (second && "#2") ||
      (third && "#3") ||
      (fourth && "#4") ||
      (fifth && "#5");

    return {
      first,
      second,
      third,
      fourth,
      fifth,
      rankingNumbers,
    };
  };

  const cardGrid = profiles?.map((data, index) => {
    const parts = data.full_name?.split(" ");
    const initials =
      parts.length > 1
        ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
        : "";

    const avatarInitials = !data.avatar_url;

    const avatarInitialsStyle = clsx({
      "bg-svg text-placeholder text-lg font-semibold": avatarInitials,
    });

    const { first, second, third, fourth, fifth, rankingNumbers } =
      rankings(index);

    const positionCardStyle = clsx({
      "border-t-4": first || second || third || fourth || fifth,
      "border-t-yellow-400 dark:border-t-yellow-500": first,
      "border-t-slate-400 dark:border-t-slate-500": second,
      "border-t-amber-800 dark:border-t-amber-950": third,
    });

    const positionPillStyle = clsx({
      "border rounded-lg w-9 h-7 text-xs font-semibold flex items-center justify-center":
        rankingNumbers,
      "border-yellow-400 dark:border-yellow-600 bg-yellow-100 dark:bg-yellow-950 text-yellow-500":
        first,
      "border-slate-400 dark:border-slate-500 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500":
        second,
      "border-amber-600 dark:border-amber-900 bg-amber-600/20 dark:bg-amber-950 text-amber-600 dark:text-amber-800":
        third,
      "border-gray-200 bg-gray-100 text-gray-400 dark:text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900":
        fourth || fifth,
    });

    const textStyles = {
      full_name: "",
      job_title: clsx("text-gray-400 dark:text-neutral-500"),
      division_name: clsx("text-gray-300 dark:text-neutral-600"),
      email: clsx("text-gray-300 dark:text-neutral-600"),
      amount: "",
    };

    const repData = {
      avatar_url: data.avatar_url,
      full_name: data.full_name,
      job_title: data.job_title,
      division_name: data.division_name,
      email: data.email,
      sale: format(data?.sales[0]?.sum ?? 0),
    };

    return (
      <div key={data.id}>
        <TeamCard
          data={repData}
          cardStyle={userRole !== "rep" ? positionCardStyle : ""}
          avatarInitialsStyle={avatarInitialsStyle}
          initials={initials}
          positionPillStyle={userRole !== "rep" ? positionPillStyle : ""}
          rankingNumbers={userRole !== "rep" ? rankingNumbers : ""}
          textStyles={textStyles}
          userRole={userRole}
        />
      </div>
    );
  });

  const worstFiveDropdown = worstFiveReps?.map((data, index) => {
    const parts = data.full_name?.split(" ");
    const initials =
      parts.length > 1
        ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
        : "";

    const avatarInitials = !data.avatar_url;

    const avatarInitialsStyle = clsx({
      "bg-svg text-placeholder text-lg font-semibold": avatarInitials,
    });

    const { first, second, third, fourth, fifth } = rankings(index);

    const cardStyle = clsx({
      "border-red-500 dark:border-red-900/20 bg-red-100/20 dark:bg-red-950/30":
        first,
      "border-red-600 dark:border-red-900/40 bg-red-100/40 dark:bg-red-950/40":
        second,
      "border-red-700 dark:border-red-900/60 bg-red-200/60 dark:bg-red-950/60":
        third,
      "border-red-800 dark:border-red-900/80 bg-red-300/60 dark:bg-red-950/80":
        fourth,
      "border-red-900 dark:border-red-900 bg-red-400/60 dark:bg-red-950": fifth,
    });

    const textStyles = {
      full_name: "text-red-800 dark:text-red-300/80",
      job_title: "text-red-700 dark:text-red-400/80",
      division_name: "text-red-600 dark:text-red-500/80",
      email: "text-red-600 dark:text-red-500/80",
      amount: "text-red-800 dark:text-red-300/80",
    };

    const repData = {
      avatar_url: data.avatar_url,
      full_name: data.full_name,
      job_title: data.job_title,
      division_name: data.division_name,
      email: data.email,
      sale: format(data?.sales[0]?.sum ?? 0),
    };

    return (
      <div key={data.id}>
        <TeamCard
          data={repData}
          cardStyle={cardStyle}
          avatarInitialsStyle={avatarInitialsStyle}
          initials={initials}
          textStyles={textStyles}
          userRole={userRole}
        />
      </div>
    );
  });

  return (
    <>
      {cardGrid}
      {userRole !== "rep" ? (
        <section className="col-span-full grid grid-cols-3 gap-8 border border-red-500 dark:border-red-900 rounded-3xl p-8 bg-red-100/20 dark:bg-red-950/30">
          <div
            className="flex justify-between items-center col-span-full cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className="flex flex-col">
              <h4 className="font-bold text-red-800 dark:text-red-300 text-lg">
                Needs Attention
              </h4>
              <span className="text-sm text-red-300 dark:text-red-200/40">
                Five worst performing reps by revenue
              </span>
            </div>
            {!isOpen ? (
              <FaChevronRight className="text-red-800" />
            ) : (
              <FaChevronDown className="text-red-800" />
            )}
          </div>
          {isOpen && worstFiveDropdown}
        </section>
      ) : null}
    </>
  );
}

import { TeamCardProps } from "@/types";

export default function TeamCard({
  data,
  cardStyle,
  avatarInitialsStyle,
  initials,
  positionPillStyle,
  rankingNumbers,
  textStyles,
  userRole,
}: TeamCardProps) {
  return (
    <div
      className={`bg-card rounded-3xl border border-gray-200 dark:border-neutral-700 ${cardStyle} flex flex-col gap-8 p-8 transition-scale duration-300 ease-out hover:scale-102`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`rounded-full w-15 h-15 text-lg flex items-center justify-center ${avatarInitialsStyle}`}
        >
          {data.avatar_url ? data.avatar_url : initials}
        </span>
        {userRole !== "rep" ? (
          <span className={`${positionPillStyle ?? ""} `}>
            {rankingNumbers ?? ""}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <span className={`font-medium mb-2 ${textStyles.full_name}`}>
          {data.full_name}
        </span>
        <span
          className={`text-gray-400 dark:text-neutral-500 text-sm ${textStyles.job_title}`}
        >
          {data.job_title}
        </span>
        <span
          className={`text-gray-300 dark:text-neutral-600 font-light text-xs ${textStyles.division_name}`}
        >
          {data.division_name}
        </span>
        <hr className="my-2 border-gray-200 dark:border-neutral-700" />
        <span
          className={`text-gray-300 dark:text-neutral-600 font-light text-xs ${textStyles.email}`}
        >
          {data.email}
        </span>
        {userRole !== "rep" ? (
          <span className={`font-medium mt-2 ${textStyles.amount}`}>
            {data.sale}
          </span>
        ) : null}
      </div>
    </div>
  );
}

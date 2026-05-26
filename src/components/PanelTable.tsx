import type { PanelTableProps } from "@/types";
import clsx from "clsx";
import { terminateContract } from "@/app/dashboard/admin/action";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

export default function PanelTable({
  profiles,
  divProfiles,
  userRole,
  start,
  end,
  currentPageNum,
  setCurrentPageNum,
  totalPageNumP,
  totalPageNumDP,
  totalUserCountP,
  totalUserCountDP,
}: PanelTableProps) {
  const dateOfJoin = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const cooTable = profiles?.map((data) => {
    const coo = data.role === "coo";
    const admin = data.role === "admin";
    const rep = data.role === "rep";

    const rolePill = clsx("rounded-full px-2 py-1", {
      "bg-black": coo,
      "text-white": coo,
      "dark:bg-white": coo,
      "dark:text-black": coo,
      "bg-gray-200": admin,
      "text-label": admin,
      "dark:bg-neutral-600": admin,
      "bg-emerald-100": rep,
      "text-emerald-600": rep,
      "dark:bg-emerald-600/20": rep,
      "dark:text-emerald-400": rep,
    });

    return (
      <div key={data.id}>
        <div className="flex items-center px-4 h-[60px]">
          <p className="text-label grow text-xs basis-1/5">{data.email}</p>
          <p className="grow text-sm basis-1/5 dark:text-white">
            {data.full_name}
          </p>
          <p className="text-label grow text-xs basis-1/5">
            <span className={`${rolePill} uppercase`}>{data.role}</span>
          </p>
          <p className="text-label grow text-xs basis-1/5">
            {dateOfJoin.format(new Date(data.created_at))}
          </p>
          {!coo ? (
            <button
              className="grow basis-1/5 mr-auto text-right"
              onClick={async () => await terminateContract(data.id)}
            >
              <span className="p-2 rounded-lg border border-red-300 text-red-500 dark:border-red-500 dark:text-red-700 ml-auto text-sm font-semibold cursor-pointer hover:bg-red-300/10 dark:hover:bg-red-600/10">
                Terminate
              </span>
            </button>
          ) : (
            <div className="basis-1/5"></div>
          )}
        </div>
        <hr className="border-gray-100 dark:border-neutral-800" />
      </div>
    );
  });

  const adminTable = divProfiles?.map((data) => {
    const admin = data.role === "admin";
    const rep = data.role === "rep";

    const rolePill = clsx("rounded-full px-2 py-1", {
      "bg-gray-200": admin,
      "text-label": admin,
      "dark:bg-neutral-600": admin,
      "bg-emerald-100": rep,
      "text-emerald-600": rep,
      "dark:bg-emerald-600/20": rep,
      "dark:text-emerald-400": rep,
    });

    return (
      <div key={data.id}>
        <div className="flex items-center px-4 h-[60px]">
          <p className="text-label grow text-xs basis-1/5">{data.email}</p>
          <p className="grow text-sm basis-1/5 dark:text-white">
            {data.full_name}
          </p>
          <p className="text-label grow text-xs basis-1/5">
            <span className={`${rolePill} uppercase`}>{data.role}</span>
          </p>
          <p className="text-label grow text-xs basis-1/5">
            {dateOfJoin.format(new Date(data.created_at))}
          </p>
          {!admin ? (
            <button
              className="grow basis-1/5 mr-auto text-right"
              onClick={async () => await terminateContract(data.id)}
            >
              <span className="p-2 rounded-lg border border-red-300 text-red-500 dark:border-red-500 dark:text-red-700 ml-auto text-sm font-semibold cursor-pointer hover:bg-red-300/10 dark:hover:bg-red-600/10">
                Terminate
              </span>
            </button>
          ) : (
            <div className="basis-1/5"></div>
          )}
        </div>
        <hr className="border-gray-100 dark:border-neutral-800" />
      </div>
    );
  });

  const windowStart =
    currentPageNum % 2 === 0 ? currentPageNum - 1 : currentPageNum;

  const current = windowStart === currentPageNum;
  const next = windowStart + 1 === currentPageNum;

  const currentActiveStyle = clsx({
    "bg-black": current,
    "text-white": current,
    "dark:bg-white": current,
    "dark:text-black": current,
  });

  const nextActiveStyle = clsx({
    "bg-black": next,
    "text-white": next,
    "dark:bg-white": next,
    "dark:text-black": next,
  });

  const disabledLeft = currentPageNum === 1;
  const disabledRight =
    userRole === "coo"
      ? currentPageNum === totalPageNumP
      : currentPageNum === totalPageNumDP;

  const leftDisabledStyle = clsx({
    "cursor-not-allowed": disabledLeft,
    "opacity-40": disabledLeft,
  });

  const rightDisabledStyle = clsx({
    "cursor-not-allowed": disabledRight,
    "opacity-40": disabledRight,
  });

  return (
    <div className="flex-1 flex flex-col bg-card border border-gray-200 rounded-3xl dark:border-neutral-700 min-h-0">
      <div className="flex p-5">
        <h4 className="text-label uppercase grow text-sm basis-1/5">Email</h4>
        <h4 className="text-label uppercase grow text-sm basis-1/5"> Name</h4>
        <h4 className="text-label uppercase grow text-sm basis-1/5">Role</h4>
        <h4 className="text-label uppercase grow text-sm basis-1/5">Joined</h4>
        <div className="grow basis-1/5"></div>
      </div>
      <hr className="border-gray-200 dark:border-neutral-700" />
      <section className="flex-1">
        {userRole === "coo" ? cooTable : adminTable}
      </section>
      <div className="flex justify-between items-center p-5">
        <span className="text-label text-sm">
          {`${start + 1}-${Math.min(end, userRole === "coo" ? totalUserCountP : totalUserCountDP)} of ${userRole === "coo" ? totalUserCountP : totalUserCountDP} users`}
        </span>
        <div className="flex gap-1">
          <button
            className={`border border-gray-200 p-2 rounded-lg dark:border-neutral-700 ${leftDisabledStyle}`}
            onClick={() =>
              currentPageNum !== 1 &&
              setCurrentPageNum((prevPageNum) => prevPageNum - 1)
            }
            disabled={currentPageNum === 1}
          >
            <FaArrowLeftLong className="w-3 h-3 text-label" />
          </button>
          <button
            className={`h-8 w-7 border border-gray-200 dark:border-neutral-700 text-label text-xs rounded-lg ${currentActiveStyle}`}
            onClick={() =>
              currentPageNum !== windowStart &&
              setCurrentPageNum((prevPageNum) => prevPageNum - 1)
            }
          >
            {windowStart}
          </button>
          {(userRole === "coo"
            ? windowStart + 1 <= totalPageNumP
            : windowStart + 1 <= totalPageNumDP) && (
            <button
              className={`h-8 w-7 border border-gray-200 dark:border-neutral-700 text-label text-xs rounded-lg ${nextActiveStyle}`}
              onClick={() =>
                (userRole === "coo"
                  ? currentPageNum < totalPageNumP
                  : currentPageNum < totalPageNumDP) &&
                setCurrentPageNum((prevPageNum) => prevPageNum + 1)
              }
            >
              {windowStart + 1}
            </button>
          )}
          <button
            className={`border border-gray-200 p-2 rounded-lg dark:border-neutral-700 ${rightDisabledStyle}`}
            onClick={() =>
              (userRole === "coo"
                ? currentPageNum < totalPageNumP
                : currentPageNum < totalPageNumDP) &&
              setCurrentPageNum((prevPageNum) => prevPageNum + 1)
            }
            disabled={
              userRole === "coo"
                ? currentPageNum === totalPageNumP
                : currentPageNum === totalPageNumDP
            }
          >
            <FaArrowRightLong className="w-3 h-3 text-label" />
          </button>
        </div>
      </div>
    </div>
  );
}

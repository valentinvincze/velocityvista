"use client";

import { LeaderboardControlProps } from "@/types";
import { useState } from "react";
import clsx from "clsx";
import LB5BChart from "../chart/LeaderboardB5BarChart";
import LW5BChart from "../chart/LeaderboardW5BarChart";

export default function LeaderboardControl({
  divisions,
  role,
  userId,
  profiles,
  divProfiles,
}: LeaderboardControlProps) {
  const [divisionValue, setDivisionValue] = useState("");
  const [bestWorstBtn, setBestWorsBtn] = useState("best");

  const focusStyle = clsx(
    "bg-white",
    "text-black",
    "dark:bg-neutral-800",
    "dark:text-white",
  );

  const scrollbarStyle = clsx({
    "no-scrollbar": divisions && divisions?.length <= 5,
    scrollbar: divisions && divisions?.length > 5,
  });

  const divFilterBtns = divisions?.map((div) => (
    <button
      key={div.id}
      onClick={() => setDivisionValue(`${div.name}`)}
      className={`px-3 py-1 rounded-md shrink-0 ${divisionValue === `${div.name}` ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
    >
      {div.name}
    </button>
  ));

  const sortedProfiles =
    profiles !== null
      ? [...(profiles ?? [])].sort(
          (a, b) => (b?.sales[0]?.sum ?? 0) - (a?.sales[0]?.sum ?? 0),
        )
      : [];

  const sortedDivProfiles =
    divProfiles !== null
      ? [...(divProfiles ?? [])].sort(
          (a, b) => (b?.sales[0]?.sum ?? 0) - (a?.sales[0]?.sum ?? 0),
        )
      : [];

  const divId = divisions?.find((div) => div.name === divisionValue)?.id;

  const filteredProfiles = sortedProfiles.filter((data) =>
    divId ? data.division_id === divId : data.division_id,
  );

  const profilesArray =
    role === "coo"
      ? filteredProfiles
      : role === "admin" || role === "rep"
        ? sortedDivProfiles
        : [];

  const qualifiedReps = profilesArray.filter(
    (data) => (data.sales[0]?.sum ?? 0) > 0,
  );

  const bestFiveReps =
    qualifiedReps.length >= 5 ? profilesArray.slice(0, 5) : [];

  const bestFiveRepsEntries =
    bestFiveReps.length === 5
      ? bestFiveReps.map((data) => {
          return {
            label: data.full_name,
            amount: data.sales[0]?.sum ?? 0,
            avatar_url: data.avatar_url,
          };
        })
      : [];

  const worstFiveReps =
    qualifiedReps.length >= 10 ? qualifiedReps.slice(-5) : [];

  const sortedWorstFiveReps = [...worstFiveReps].sort(
    (a, b) => (a?.sales[0]?.sum ?? 0) - (b?.sales[0]?.sum ?? 0),
  );

  const worstFiveRepsEntries =
    sortedWorstFiveReps.length === 5
      ? sortedWorstFiveReps.map((data) => {
          return {
            label: data.full_name,
            amount: data.sales[0]?.sum ?? 0,
            avatar_url: data.avatar_url,
          };
        })
      : [];

  const repPosition =
    sortedDivProfiles.findIndex((data) => data.id === userId) + 1;

  const positionStyle = clsx({
    "text-yellow-500": repPosition === 1,
    "text-slate-400 dark:text-slate-500": repPosition === 2,
    "text-amber-600 dark:text-amber-800": repPosition === 3,
    "text-gray-400 dark:text-neutral-600":
      repPosition === 4 || repPosition === 5,
  });

  return (
    <section className="flex flex-col gap-10">
      {role === "coo" ? (
        <div className="flex justify-between items-center">
          <div
            className={`bg-gray-100 p-1 rounded-lg dark:bg-neutral-700 flex gap-1 ${role === "coo" ? "w-[882px]" : "inline-flex"}
    overflow-x-auto ${scrollbarStyle} scroll-smooth
    min-w-0`}
          >
            <>
              <button
                onClick={() => setDivisionValue("")}
                className={`px-3 py-1 rounded-md shrink-0 ${divisionValue === "" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
              >
                All
              </button>
              {divFilterBtns}{" "}
            </>
          </div>
        </div>
      ) : null}
      <div
        className={`${role === "coo" ? "h-[770px]" : "h-[855px]"} bg-card rounded-3xl border border-gray-200 dark:border-neutral-700 p-8`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center gap-2">
              <h4 className="text-label text-lg">Top Performers</h4>
              <span className="text-sm text-gray-400 dark:text-neutral-500">
                By secured deal revenue
              </span>
            </div>
            {role !== "rep" ? (
              <div className="bg-gray-100 p-1 rounded-lg dark:bg-neutral-700">
                <button
                  onClick={() => setBestWorsBtn("best")}
                  className={`px-3 py-1 rounded-md ${bestWorstBtn === "best" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
                >
                  Best Five
                </button>
                <button
                  onClick={() => setBestWorsBtn("worst")}
                  className={`px-3 py-1 rounded-md ${bestWorstBtn === "worst" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
                >
                  Worst Five
                </button>
              </div>
            ) : (
              <span className="text-label text-sm">
                You are ranked{" "}
                <span className={positionStyle}>#{repPosition}</span> out of{" "}
                {sortedDivProfiles.length} users
              </span>
            )}
          </div>
          <div className={role === "coo" ? "h-[620px]" : "h-[700px]"}>
            {bestWorstBtn === "best" || role === "rep" ? (
              qualifiedReps.length >= 5 ? (
                <LB5BChart entries={bestFiveRepsEntries} />
              ) : (
                <span className="h-full flex items-center justify-center text-xl">
                  Yet to be determined!
                </span>
              )
            ) : bestWorstBtn === "worst" ? (
              worstFiveReps.length === 5 ? (
                <LW5BChart entries={worstFiveRepsEntries} />
              ) : (
                <span className="h-full flex items-center justify-center text-xl">
                  Yet to be determined!
                </span>
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

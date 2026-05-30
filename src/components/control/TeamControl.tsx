"use client";

import { useState } from "react";
import clsx from "clsx";
import type { TeamControlProps, RepData } from "@/types";
import TeamGrid from "../TeamGrid";

export default function TeamControl({
  divisions,
  role,
  profiles,
  divProfiles,
}: TeamControlProps) {
  const [divisionValue, setDivisionValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
          (a, b) => b?.sales[0]?.sum - a?.sales[0]?.sum,
        )
      : [];

  const sortedDivProfiles =
    divProfiles !== null
      ? [...(divProfiles ?? [])].sort(
          (a, b) => b?.sales[0]?.sum - a?.sales[0]?.sum,
        )
      : [];

  const divId = divisions?.find((div) => div.name === divisionValue)?.id;

  const filteredProfiles = sortedProfiles.filter((data) =>
    divId ? data.division_id === divId : data.division_id,
  );

  const addDivName = (data: RepData) =>
    data?.map((data) => {
      const name =
        data.division_id &&
        divisions?.find((div) => div.id === data.division_id)?.name;
      return {
        ...data,
        division_name: name || "",
      };
    }) ?? [];

  const profilesWithDivName =
    role === "coo"
      ? addDivName(filteredProfiles)
      : role === "admin"
        ? addDivName(sortedDivProfiles)
        : addDivName(divProfiles);

  const userCount = profilesWithDivName.length || 0;

  return (
    <section className="flex flex-col gap-10 min-h-0">
      <div className="flex justify-between items-center">
        <div
          className={`bg-gray-100 p-1 rounded-lg dark:bg-neutral-700 flex gap-1 ${role === "coo" ? "w-[882px]" : "inline-flex"}
    overflow-x-auto ${scrollbarStyle} scroll-smooth
    min-w-0`}
        >
          {role === "coo" ? (
            <>
              <button
                onClick={() => setDivisionValue("")}
                className={`px-3 py-1 rounded-md shrink-0 ${divisionValue === "" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
              >
                All
              </button>
              {divFilterBtns}{" "}
            </>
          ) : (
            <button
              disabled
              className={`px-3 py-1 rounded-md shrink-0 ${divisionValue === "" ? focusStyle : `text-gray-300 dark:text-neutral-600`}`}
            >
              {profilesWithDivName?.[0]?.division_name ?? ""}
            </button>
          )}
        </div>
        <span className="text-label">{userCount} users</span>
      </div>
      <div className="relative">
        <div className="grid grid-cols-3 gap-8 h-[770px] overflow-y-auto no-scrollbar scroll-smooth min-h-0">
          <TeamGrid
            profiles={
              role === "rep"
                ? profilesWithDivName
                : profilesWithDivName.slice(0, -5)
            }
            worstFiveReps={profilesWithDivName.slice(-5)}
            userRole={role}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
        <div className="absolute bottom-0 bg-gradient-to-b from-transparent to-page h-10 w-full"></div>
      </div>
    </section>
  );
}

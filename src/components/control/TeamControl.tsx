"use client";

import { useState } from "react";
import clsx from "clsx";
import type { TeamControlProps, RepData } from "@/types";
import TeamGrid from "../TeamGrid";
import { FaArrowDownLong } from "react-icons/fa6";

export default function TeamControl({
  divisions,
  role,
  id,
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

  const userCard = divProfiles?.find((data) => data.id === id);

  const rest = divProfiles?.filter((data) => data.id !== id) ?? [];

  const repProfiles = userCard ? [userCard, ...rest] : divProfiles;

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
        : addDivName(repProfiles);

  const userCount = profilesWithDivName.length || 0;

  const qualifiedReps = profilesWithDivName.filter(
    (data) => (data.sales[0].sum ?? 0) > 0,
  );

  const zeroReps = profilesWithDivName.filter(
    (data) => data.sales[0].sum === null,
  );

  const worstFiveReps =
    qualifiedReps.length >= Math.floor(profilesWithDivName.length / 2) &&
    zeroReps.length >= 5
      ? profilesWithDivName.slice(-zeroReps.length)
      : qualifiedReps.length >= Math.floor(profilesWithDivName.length / 2)
        ? profilesWithDivName.slice(-5)
        : [];

  const bestFiveReps =
    qualifiedReps.length >= Math.floor(profilesWithDivName.length / 2) &&
    zeroReps.length >= 5
      ? profilesWithDivName.slice(0, -zeroReps.length)
      : qualifiedReps.length >= Math.floor(profilesWithDivName.length / 2)
        ? profilesWithDivName.slice(0, -5)
        : profilesWithDivName;

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
        <div className="flex gap-4">
          <span className="text-label">{userCount} users</span>
          <div className="flex items-center text-red-500">
            {role !== "rep" &&
              qualifiedReps.length >=
                Math.floor(profilesWithDivName.length / 2) && (
                <>
                  <span>Needs attention</span>
                  <FaArrowDownLong className="w-4 h-4" />
                </>
              )}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="grid grid-cols-3 gap-8 h-[770px] overflow-y-auto no-scrollbar scroll-smooth min-h-0">
          <TeamGrid
            profiles={
              role === "rep" || qualifiedReps.length <= 5
                ? profilesWithDivName
                : bestFiveReps
            }
            worstFiveReps={worstFiveReps}
            userRole={role}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            qualifiedReps={qualifiedReps}
            profilesWithDivName={profilesWithDivName}
          />
        </div>
        <div className="absolute bottom-0 bg-gradient-to-b from-transparent to-page h-10 w-full"></div>
      </div>
    </section>
  );
}

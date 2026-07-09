"use client";

import { PanelControlProps } from "@/types";
import { useState } from "react";
import PanelTable from "../PanelTable";
import { ProfileData } from "@/types";

export default function PanelControl({
  role,
  divisions,
  profiles,
  divProfiles,
}: PanelControlProps) {
  const [searchValue, setSearchValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [divisionValue, setDivisionValue] = useState("");
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const divisionOptions = divisions?.map((div) => (
    <option key={div.id} value={div.name}>
      {div.name}
    </option>
  ));

  const roleOrder = { coo: 0, admin: 1, rep: 2 };

  const sortedProfileData = [...(profiles ?? [])].sort(
    (a, b) => roleOrder[a.role] - roleOrder[b.role],
  );

  const sortedDivProfileData = [...(divProfiles ?? [])].sort(
    (a, b) => roleOrder[a.role] - roleOrder[b.role],
  );

  const divId = divisions?.find((div) => div.name === divisionValue)?.id;

  const filteredProfilesData =
    role === "coo"
      ? sortedProfileData?.filter(
          (data) =>
            (!divId || data.division_id === divId) &&
            (!roleValue || data.role === roleValue) &&
            (!searchValue || data.email.includes(searchValue.toLowerCase())),
        )
      : sortedDivProfileData?.filter(
          (data) =>
            (!roleValue || data.role === roleValue) &&
            (!searchValue || data.email.includes(searchValue.toLowerCase())),
        );

  const addDivName = (data: ProfileData) =>
    data?.map((data) => {
      const name =
        data.division_id &&
        divisions?.find((div) => div.id === data.division_id)?.name;
      return {
        ...data,
        division_name: name || "",
      };
    }) ?? [];

  const profilesWithDivName = addDivName(filteredProfilesData);

  const pageSize = 7;

  const start = (currentPageNum - 1) * pageSize;
  const end = currentPageNum * pageSize;

  const totalPageNum = Math.ceil(filteredProfilesData.length / pageSize);

  const totalUserCount = filteredProfilesData.length;

  return (
    <>
      <div className="flex items-center gap-4">
        <input
          id="search"
          className="w-[333px] bg-card border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 placeholder:text-placeholder dark:focus:ring-neutral-500 dark:focus:border-neutral-600 px-2 py-1"
          type="text"
          placeholder="Search by email..."
          onChange={(e) => {
            setSearchValue(e.target.value);
            setCurrentPageNum(1);
          }}
        ></input>
        {role === "coo" && (
          <select
            id="division-select"
            className="bg-card appearance-none border border-gray-200 rounded-lg px-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-600 text-center"
            defaultValue=""
            onChange={(e) => {
              setDivisionValue(e.target.value);
              setCurrentPageNum(1);
            }}
          >
            <option value="">All divisions</option>
            {divisionOptions}
          </select>
        )}
        <select
          id="role-select"
          className="w-[210px] bg-card appearance-none border border-gray-200 rounded-lg px-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-600 text-center"
          defaultValue=""
          onChange={(e) => {
            setRoleValue(e.target.value);
            setCurrentPageNum(1);
          }}
        >
          <option value="">All roles</option>
          {role === "coo" && <option value="coo">COO</option>}
          <option value="admin">Admin</option>
          <option value="rep">Rep</option>
        </select>
      </div>
      <PanelTable
        profiles={profilesWithDivName.slice(start, end)}
        userRole={role}
        start={start}
        end={end}
        currentPageNum={currentPageNum}
        setCurrentPageNum={setCurrentPageNum}
        totalPageNum={totalPageNum}
        totalUserCount={totalUserCount}
      />
    </>
  );
}

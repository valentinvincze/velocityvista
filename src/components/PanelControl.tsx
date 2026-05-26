"use client";

import { PanelControlProps } from "@/types";
import { useState } from "react";
import PanelTable from "./PanelTable";

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

  const divId = divisions?.find((div) => div.name === divisionValue && div.id);

  const filteredProfilesData = sortedProfileData?.filter(
    (data) =>
      (divId
        ? data.division_id === divId.id
        : data.division_id || data.role === "coo") &&
      (roleValue ? data.role === roleValue : data.role) &&
      (searchValue ? data.email.includes(searchValue) : data.email),
  );

  const filteredDivProfilesData = sortedDivProfileData?.filter(
    (data) =>
      (divId ? data.division_id === divId?.id : data.division_id) &&
      (roleValue ? data.role === roleValue : data.role) &&
      (searchValue ? data.email.includes(searchValue) : data.email),
  );

  const pageSize = 7;

  const start = (currentPageNum - 1) * pageSize;
  const end = currentPageNum * pageSize;

  const totalPageNumP = Math.ceil(filteredProfilesData.length / pageSize);
  const totalPageNumDP = Math.ceil(filteredDivProfilesData.length / pageSize);

  const totalUserCountP = filteredProfilesData.length;
  const totalUserCountDP = filteredDivProfilesData.length;

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
            className="w-[157px] bg-card appearance-none border border-gray-200 rounded-lg px-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-600 text-center"
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
          className="w-[157px] bg-card appearance-none border border-gray-200 rounded-lg px-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-600 text-center"
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
        profiles={filteredProfilesData.slice(start, end)}
        divProfiles={filteredDivProfilesData.slice(start, end)}
        userRole={role}
        start={start}
        end={end}
        currentPageNum={currentPageNum}
        setCurrentPageNum={setCurrentPageNum}
        totalPageNumP={totalPageNumP}
        totalPageNumDP={totalPageNumDP}
        totalUserCountP={totalUserCountP}
        totalUserCountDP={totalUserCountDP}
      />
    </>
  );
}

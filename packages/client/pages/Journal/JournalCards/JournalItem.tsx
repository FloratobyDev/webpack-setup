import React, { useState } from "react";
import dayjs from "dayjs";
import HoverDropdown from "./HoverDropdown";
import { JournalType } from "@client/types";
import { useAuth } from "@client/contexts/AuthProvider";
import { useRepository } from "@client/contexts/RepositoryContext";

type Props = {
  value: JournalType;
  setOpenModal: (value: boolean) => void;
  setCurrentJournal: (value: any) => void;
  handleAddBookmark: (value: any) => void;
};

function JournalItem({
  value,
  setOpenModal,
  setCurrentJournal,
  handleAddBookmark,
}: Props) {
  const [hover, setHover] = useState(false);
  const { currentRepository } = useRepository();
  const { currentUser } = useAuth();

  return (
    <div
      className="flex justify-between px-2 py-1.5 rounded-smd hover:bg-black-75 cursor-pointer"
      onClick={() => {
        setOpenModal(true);
        setCurrentJournal(value);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center gap-x-2">
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            handleAddBookmark(value);
          }}
        >
          {value.is_bookmarked && (
            <svg
              fill="none"
              height="14"
              viewBox="0 0 14 14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.80768 1.01186C6.95735 0.551208 7.60906 0.55121 7.75873 1.01187L8.96706 4.73071C9.034 4.93672 9.22597 5.0762 9.44259 5.0762H23.3528C13.8372 5.0762 14.0386 5.69601 13.6467 5.98071L10.4833 8.27909C10.308 8.40641 10.2347 8.63209 10.3016 8.8381L11.51 12.5569C11.6596 13.0176 11.1324 13.4007 10.7405 13.116L7.5771 10.8176C7.40185 10.6903 7.16455 10.6903 6.98931 10.8176L3.82587 13.116C3.43401 13.4007 2.90677 13.0176 3.05645 12.5569L4.26478 8.8381C4.33171 8.63209 4.25838 8.40641 4.08314 8.27909L0.919699 5.98071C0.527842 5.69601 0.729231 5.0762 1.21359 5.0762H5.12382C5.34043 5.0762 5.53241 4.93672 5.59935 4.73071L6.80768 1.01186Z"
                fill="#DFB626"
              />
            </svg>
          )}
          {!value.is_bookmarked && (
            <svg
              fill="none"
              height="13"
              viewBox="0 0 14 13"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.53198 12.0363L4.7403 8.31744C4.87418 7.90542 4.72752 7.45405 4.37703 7.19941L1.21359 4.90103L5.12382 4.90103C5.55705 4.90103 5.941 4.62207 6.07488 4.21005L7.2832 0.491201L8.49153 4.21005C8.62541 4.62207 9.00936 4.90103 9.44259 4.90103H13.3528L10.1894 7.19941C9.83889 7.45405 9.69223 7.90542 9.8261 8.31744L11.0344 12.0363L7.87099 9.73791C7.5205 9.48327 7.0459 9.48327 6.69542 9.73791L3.53198 12.0363ZM3.53198 12.0363L3.05645 11.8818L3.53198 12.0363L3.82587 12.4408L3.53198 12.0363Z"
                stroke="#CFCFCF"
              />
            </svg>
          )}
        </button>
        <p>{value.title}</p>
      </div>
      <div className="flex gap-x-2">
        <div className="flex gap-x-2">
          {value.commits?.length > 0 && (
            <HoverDropdown hovered={hover} label="Commits">
              {value.commits.map((commit) => {
                const commitLink = `https://github.com/${currentUser}/${currentRepository.name}/commit/${commit.commit_sha}`;
                return (
                  <a
                    className="w-full hover:bg-black-75 px-2 py-0.5 cursor-pointer whitespace-nowrap rounded-smd"
                    href={commitLink}
                    key={commit.commit_sha}
                    onClick={(e: any) => e.stopPropagation()}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {commit.commit_sha.substring(0, 8)}
                  </a>
                );
              })}
            </HoverDropdown>
          )}
          {value.tasks?.length > 0 && (
            <HoverDropdown hovered={hover} label="Tasks">
              {value.tasks.map((task) => (
                <p
                  className="w-full hover:bg-black-75 px-2 py-0.5 cursor-pointer whitespace-nowrap rounded-smd"
                  key={task.id}
                >
                  {task.title}
                </p>
              ))}
            </HoverDropdown>
          )}
        </div>
        <p>{dayjs(value.created_at).format("MM/DD/YYYY")}</p>
      </div>
    </div>
  );
}

export default JournalItem;

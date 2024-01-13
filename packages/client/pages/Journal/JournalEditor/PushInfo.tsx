import { CommitType, PushType } from "@client/types";
import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { H4 } from "@client/components/headings";
import { map } from "lodash";

type Props = {
  pushInfo: PushType;
  selectedCommits: CommitType[];
  onSelect: (commit: CommitType) => void;
  onSelectMultiple: (commit: CommitType[]) => void;
  onDeselect: (commit: CommitType) => void;
  onDeselectMultiple: (commit: CommitType[]) => void;
};

function PushInfo({
  selectedCommits,
  pushInfo,
  onSelect,
  onSelectMultiple,
  onDeselect,
  onDeselectMultiple,
}: Props) {
  const [open, setOpen] = useState<boolean>(true);
  const [pushSelected, setPushSelected] = useState<boolean>(false);

  function handleOpen() {
    setOpen(!open);
  }

  const difficultyClass = classNames(
    "h-2 w-2 bg-red-400 rounded-full absolute top-0 right-0",
    {
      "bg-red-400": pushInfo.has_interacted,
    },
  );

  const selectedCommitsInPushCount = useMemo(
    () =>
      pushInfo.commits.filter((commit) => selectedCommits.includes(commit))
        .length,
    [selectedCommits],
  );

  return (
    <div className="rounded-md bg-black-75 overflow-hidden select-none text-white relative max-h-full">
      <div className={difficultyClass} />
      <div
        className="flex items-center justify-between p-2 px-3 relative"
        onClick={handleOpen}
      >
        <H4>{pushInfo.pushAt}</H4>
        <div className="flex gap-x-2">
          <p className="text-yellow-400 italic">
            {selectedCommitsInPushCount}/{pushInfo.commits.length}
          </p>
          <button
            onClick={(e: any) => {
              e.stopPropagation();
              setPushSelected(!pushSelected);
              if (pushSelected) {
                onDeselectMultiple(pushInfo.commits);
              } else {
                onSelectMultiple(pushInfo.commits);
              }
            }}
          >
            {pushSelected ||
            pushInfo.commits.every((e) => {
              return selectedCommits.includes(e);
            })
              ? "-"
              : "+"}
          </button>
        </div>
      </div>
      {open && (
        <>
          <hr className="border-t-1 border-t-yellow-300" />
          <div className="p-2">
            {map(pushInfo.commits, (commitInfo) => (
              <div
                className="flex justify-between p-1"
                key={commitInfo.commit_sha}
              >
                <p className="truncate w-32">{commitInfo.message}</p>
                <div className="flex gap-x-2">
                  <p className="">{commitInfo.commit_sha}</p>
                  <button
                    onClick={() => {
                      if (selectedCommits.includes(commitInfo)) {
                        onDeselect(commitInfo);
                      } else {
                        onSelect(commitInfo);
                      }
                    }}
                  >
                    {selectedCommits.includes(commitInfo) ? "-" : "+"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PushInfo;

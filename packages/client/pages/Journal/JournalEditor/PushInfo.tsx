import { CommitType, PushType } from "@client/types";
import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { H4 } from "@client/components/headings";
import { map } from "lodash";
import { useUpdateNotificationHasInteractedMutation } from "@client/store";

type Props = {
  pushInfo: PushType;
  setPushList: (args: (pushList: PushType[]) => PushType[]) => void;
  selectedCommits: CommitType[];
  onSelect: (commit: CommitType) => void;
  onSelectMultiple: (commit: CommitType[]) => void;
  onDeselect: (commit: CommitType) => void;
  onDeselectMultiple: (commit: CommitType[]) => void;
};

function PushInfo({
  selectedCommits,
  pushInfo,
  setPushList,
  onSelect,
  onSelectMultiple,
  onDeselect,
  onDeselectMultiple,
}: Props) {
  const [open, setOpen] = useState<boolean>(true);
  const [pushSelected, setPushSelected] = useState<boolean>(false);
  const [hasNotification, setHasNotification] = useState<boolean>(
    !pushInfo.has_interacted,
  );

  const [
    mutateNotification,
    {
      isLoading: isNotificationLoading,
      data: notificationData,
      isSuccess: isNotificationSuccess,
      isError: isNotificationError,
      error: notificationError,
    },
  ] = useUpdateNotificationHasInteractedMutation();

  function handleOpen() {
    setOpen(!open);
  }

  function handleNotification() {
    if (hasNotification) {
      mutateNotification({
        push_id: pushInfo.push_id,
        notification_id: pushInfo.notification_id,
      });
      setHasNotification(false);
      setPushList((prevPushList: PushType[]) => {
        return prevPushList.map((push) => {
          if (push.push_id === pushInfo.push_id) {
            return { ...push, has_interacted: true };
          }
          return push;
        });
      });
    }
  }

  const notificationClass = classNames(
    "h-2 w-2 rounded-full absolute top-0 right-0",
    {
      "bg-red-400": hasNotification,
      "bg-transparent": !hasNotification,
    },
  );

  const selectedCommitsInPushCount = useMemo(
    () =>
      pushInfo.commits.filter((commit) => selectedCommits.includes(commit))
        .length,
    [selectedCommits],
  );

  return (
    <div
      className="rounded-md bg-black-75 overflow-hidden select-none text-white relative max-h-full"
      onClick={handleNotification}
    >
      <div className={notificationClass} />
      <div
        className="flex items-center justify-between p-2 px-3 relative"
        onClick={handleOpen}
      >
        <H4>{pushInfo.created_at}</H4>
        <div className="flex gap-x-2">
          <p className="text-yellow-400 italic">
            {selectedCommitsInPushCount}/{pushInfo.commits.length}
          </p>
          <button
            onClick={(e: any) => {
              e.stopPropagation();
              setHasNotification(false);
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
                <p className="truncate w-32">{commitInfo.description}</p>
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

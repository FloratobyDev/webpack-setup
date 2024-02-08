import { CommitType, PushType } from "@client/types";
import React, { useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { H4 } from "@client/components/headings";
import { map } from "lodash";
import { useAuth } from "@client/contexts/AuthProvider";
import { useRepository } from "@client/contexts/RepositoryContext";
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
  const { currentRepository } = useRepository();
  const { currentUser } = useAuth();

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
    "h-2 w-2 rounded-full absolute -top-0.5 -right-0.5",
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
      className="rounded-smd bg-black-75 select-none text-white relative max-h-full"
      onClick={handleNotification}
    >
      <div className={notificationClass} />
      <div
        className="flex items-center justify-between p-2 px-3 gap-x-2 relative"
        onClick={handleOpen}
      >
        <H4 classname="text-sm whitespace-nowrap font-extrabold">
          {dayjs(pushInfo.created_at).format("MMMM DD, YYYY HH:MM A")}
        </H4>
        <div className="flex gap-x-2 items-center">
          <p className="text-primary-yellow font-extrabold text-sm">
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
                const unselectedCommits = pushInfo.commits.filter(
                  (commit) => !selectedCommits.includes(commit),
                );
                onSelectMultiple(unselectedCommits);
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
          <hr className="border-t-1 border-t-primary-black" />
          <div className="p-2">
            {map(pushInfo.commits, (commitInfo) => {
              const commitLink = `https://github.com/${currentUser}/${currentRepository.name}/commit/${commitInfo.commit_sha}`;
              return (
                <div
                  className="flex justify-between px-2 py-1 hover:bg-primary-black rounded-smd cursor-pointer gap-x-10"
                  key={commitInfo.commit_sha}
                  onClick={() => {
                    if (selectedCommits.includes(commitInfo)) {
                      onDeselect(commitInfo);
                      if (
                        selectedCommits.length - 1 <
                        pushInfo.commits.length
                      ) {
                        setPushSelected(false);
                      }
                    } else {
                      onSelect(commitInfo);
                      if (
                        selectedCommits.length + 1 >=
                        pushInfo.commits.length
                      ) {
                        setPushSelected(true);
                      }
                    }
                  }}
                >
                  <p className="truncate w-32">{commitInfo.description}</p>
                  <div className="flex gap-x-2">
                    <a
                      className="px-1 bg-black-50 rounded-smd"
                      href={commitLink}
                      onClick={(e: any) => e.stopPropagation()}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {commitInfo.commit_sha.substring(0, 5)}
                    </a>
                    <button>
                      {selectedCommits.includes(commitInfo) ? "-" : "+"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default PushInfo;

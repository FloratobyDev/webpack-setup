import { H2 } from "@client/components/headings";
import JournalCards from "./JournalCards";
import JournalEditor from "./JournalEditor";
import JournalRepositories from "./JournalRepositories";
import React from "react";
import RepositoryInfo from "./RepositoryInfo";
import SubLayout from "@client/components/layout/SubLayout";
import TaskCards from "./TaskCards";
import TaskEditor from "./TaskEditor";
import TaskProvider from "@client/contexts/TaskContext";
import { useRepository } from "@client/contexts/RepositoryContext";
import { useUpdateNotificationsMutation } from "@client/store";

function Journal() {
  const {
    currentRepository,
    repositories,
    changeRepository,
    updateRepositoryAlertById,
  } = useRepository();

  const [updateNotification, { isLoading, isSuccess, isError, error }] =
    useUpdateNotificationsMutation();

  if (!currentRepository) {
    return (
      <div className="flex items-center justify-center w-full">
        <H2 classname="italic text-sub-paragraph">No repositories available</H2>
      </div>
    );
  }

  const installApp = () => {
    const appName = "JournalVerse"; // Replace with your actual client ID
    const githubInstallUrl = `https://github.com/apps/${appName}/installations/new`;
    // Redirect the browser to GitHub's OAuth page
    window.location.href = githubInstallUrl;
  };

  function handleNotificationClick() {
    if (currentRepository.hasAlerts) {
      console.log(
        "currentRepository.notifications",
        currentRepository.notifications,
      );

      updateNotification(currentRepository.notifications);
      updateRepositoryAlertById(currentRepository.id);
    }
  }

  return (
    <div className="flex h-full w-full">
      {/* <button onClick={installApp}>Install App</button> */}
      <div className="w-[20%] max-w-[18%] flex-col min-h-full h-full border-r border-r-primary-outline">
        <SubLayout
          classnames="overflow-auto flex border-b border-b-primary-outline"
          style={{
            maxHeight: "14rem",
          }}
        >
          <RepositoryInfo
            description={currentRepository.description}
            languages={[]}
            name={currentRepository.name}
          />
        </SubLayout>
        <SubLayout
          style={{
            height: "calc(100vh - 14rem)",
          }}
        >
          <JournalRepositories
            activeRepo={currentRepository}
            onClick={changeRepository}
            repositories={repositories}
          />
        </SubLayout>
      </div>
      <div
        className="flex-1 flex flex-col overflow-auto h-full"
        onClick={handleNotificationClick}
      >
        <SubLayout classnames="basis-0" transparent>
          <JournalEditor />
        </SubLayout>
        <SubLayout classnames="flex-1" transparent>
          <JournalCards />
        </SubLayout>
      </div>
      <TaskProvider>
        <div className="w-[24%] flex flex-col max-h-full h-full border-l border-l-primary-outline">
          {/* This div is flex-1, allowing it to take up all available space minus what's needed for siblings */}
          <SubLayout classnames="flex-1 border-b border-b-primary-outline">
            <TaskEditor />
          </SubLayout>
          {/* This SubLayout should grow to use available space, making TaskCards scrollable if content overflows */}
          <SubLayout classnames="h-full overflow-auto">
            <TaskCards />
          </SubLayout>
        </div>
      </TaskProvider>
    </div>
  );
}

export default Journal;

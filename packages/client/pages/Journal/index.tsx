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
    return null;
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
    <div className="flex min-h-full h-full w-full">
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
        className="flex-1 flex flex-col overflow-auto"
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
        <div className="w-[24%] flex flex-col min-h-full h-full border-l border-l-primary-outline">
          <div className="flex-1">
            <SubLayout
              classnames="flex-1 border-b border-b-primary-outline"
            >
              <TaskEditor />
            </SubLayout>
          </div>
          <SubLayout
          >
            <TaskCards />
          </SubLayout>
        </div>
      </TaskProvider>
    </div>
  );
}

export default Journal;

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

function Journal() {
  const {
    currentRepository,
    repositories,
    changeRepository,
    bookmarks,
    setBookmarks,
    journals,
  } = useRepository();

  if (!currentRepository) {
    return null;
  }

  const installApp = () => {
    const appName = "JournalVerse"; // Replace with your actual client ID
    const githubInstallUrl = `https://github.com/apps/${appName}/installations/new`;
    // Redirect the browser to GitHub's OAuth page
    window.location.href = githubInstallUrl;
  };

  return (
    <div className="flex flex-1 min-h-full h-full">
      {/* <button onClick={installApp}>Install App</button> */}
      <div className="basis-[16.5%] flex gap-y-1 ml-1 flex-col min-h-full h-full">
        <SubLayout
          classnames="overflow-auto"
          style={{
            maxHeight: "14rem",
          }}
        >
          <RepositoryInfo
            description={currentRepository.repositoryInfo.description}
            languages={currentRepository.repositoryInfo.languages}
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
      <div className="flex-1 flex flex-col gap-y-1">
        <SubLayout classnames="basis-0" transparent>
          <JournalEditor />
        </SubLayout>
        <SubLayout classnames="flex-1" transparent>
          <JournalCards
            bookmarks={bookmarks}
            journals={journals}
            setBookmarks={setBookmarks}
          />
        </SubLayout>
      </div>
      <TaskProvider>
        <div className="basis-[22%] flex gap-y-1 flex-col min-h-full h-full">
          <SubLayout
            style={{
              maxHeight: "16rem",
            }}
          >
            <TaskEditor />
          </SubLayout>
          <SubLayout
            style={{
              height: "calc(100vh - 16rem)",
            }}
          >
            <TaskCards />
          </SubLayout>
        </div>
      </TaskProvider>
    </div>
  );
}

export default Journal;

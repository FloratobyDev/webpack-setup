import React, { useEffect, useState } from "react";
import JournalCards from "./JournalCards";
import JournalEditor from "./JournalEditor";
import JournalRepositories from "./JournalRepositories";
import RepositoryInfo from "./RepositoryInfo";
import SubLayout from "@client/components/layout/SubLayout";
import TaskCards from "./TaskCards";
import TaskEditor from "./TaskEditor";

function Journal() {
  const [activeRepo, setActiveRepo] = useState<string>(null);
  const repositories = ["repositories1", "repos-2"];
  const languages = ["language1", "language2"];

  useEffect(() => {
    setActiveRepo(repositories[0]);
  }, []);

  function handleRepoClick(repo: string) {
    setActiveRepo(repo);
  }

  return (
    <div className="flex flex-1 min-h-full h-full">
      <div className="basis-[16.5%] flex gap-y-1 ml-1 flex-col min-h-full h-full">
        <SubLayout classnames="max-h-[14rem] overflow-auto">
          <RepositoryInfo
            description="description"
            languages={languages}
            name="name"
          />
        </SubLayout>
        <SubLayout classnames="h-[calc(100vh-14rem)]">
          <JournalRepositories
            activeRepo={activeRepo}
            onClick={handleRepoClick}
            repositories={repositories}
          />
        </SubLayout>
      </div>
      <div className="flex-1 flex flex-col gap-y-1">
        <SubLayout classnames="basis-0" transparent>
          <JournalEditor />
        </SubLayout>
        <SubLayout classnames="flex-1" transparent>
          <JournalCards />
        </SubLayout>
      </div>
      <div className="basis-[22%] flex gap-y-1 flex-col">
        <SubLayout>
          <TaskEditor />
        </SubLayout>
        <SubLayout>
          <TaskCards />
        </SubLayout>
      </div>
    </div>
  );
}

export default Journal;

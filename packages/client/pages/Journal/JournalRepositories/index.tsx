import Calendar from "./Calendar";

import { H5 } from "@client/components/headings";
import React from "react";
import RepoButton from "./RepoButton";

type Props = {
  repositories: string[];
  activeRepo: string;
  onClick: (repo: string) => void;
};

function JournalRepositories({ repositories, activeRepo, onClick }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <H5>Repositories</H5>
        <button className="text-sm">Add</button>
      </div>
      <div className="flex flex-col overflow-auto my-2 grow">
        {repositories.map((repository) => (
          <RepoButton
            // hasAlert={repository === activeRepo}
            active={repository === activeRepo}
            key={repository}
            name={repository}
            onClick={() => onClick(repository)}
          />
        ))}
      </div>
      <div className="flex">
        <Calendar />
      </div>
    </div>
  );
}

export default JournalRepositories;

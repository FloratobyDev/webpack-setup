import React, { useMemo, useState } from "react";
import Calendar from "./Calendar";
import { H4 } from "@client/components/headings";
import Paper from "@client/components/layout/Paper";
import RepoButton from "./RepoButton";
import { RepositoryType } from "@client/types";
import SearchBar from "@client/components/searchbar/SearchBar";

type Props = {
  repositories: RepositoryType[];
  activeRepo: RepositoryType;
  onClick: (repo: RepositoryType) => void;
};

function JournalRepositories({ repositories, activeRepo, onClick }: Props) {
  const [search, setSearch] = useState("");

  function handleSearchChange(e: any) {
    setSearch(e.target.value);
  }

  const modifiedRepositories = useMemo(() => {
    return repositories.filter((repository) => {
      return repository.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [repositories, search]);

  return (
    <Paper classname="flex justify-between w-full h-full flex-col">
      <div className="flex justify-between items-center gap-x-4 w-full max-w-full">
        <H4 classname="font-black capitalize text-primary-yellow whitespace-nowrap">
          Journal Repositories
        </H4>
        {/* <p className="whitespace-normal min-w-0 break-words">hhhhhhhhhhhhhhhhhhhhhhhh</p> */}
        <SearchBar className="h-8" onChange={handleSearchChange} search={search}/>
      </div>
      <div className="flex flex-col overflow-auto my-2 grow">
        {modifiedRepositories.map((repository) => (
          <RepoButton
            active={repository.id === activeRepo.id}
            hasAlert={repository.hasAlerts}
            key={repository.id}
            name={repository.name}
            onClick={() => onClick(repository)}
          />
        ))}
      </div>
      <div className="flex">
        <Calendar />
      </div>
    </Paper>
  );
}

export default JournalRepositories;

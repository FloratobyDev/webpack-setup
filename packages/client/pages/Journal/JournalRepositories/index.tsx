import React, { useMemo, useState } from "react";
import Calendar from "./Calendar";
import { H5 } from "@client/components/headings";
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

  console.log('repositoriesss', modifiedRepositories);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <H5>Repositories</H5>
        <SearchBar onChange={handleSearchChange} search={search} />
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
    </div>
  );
}

export default JournalRepositories;

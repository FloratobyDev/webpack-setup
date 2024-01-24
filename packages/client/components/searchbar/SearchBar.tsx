import React from "react";
import Search from "@client/components/svgs/Search";

type Props = {
  search: string;
  onChange: (event: any) => void;
};

function SearchBar({ search, onChange }: Props) {
  return (
    <div className="flex justify-between font-poppins items-center px-3 py-1 gap-x-2 rounded-lg bg-blue-400 text-white">
      <input
        className="flex-1 bg-transparent outline-none text-white"
        onChange={onChange}
        type="text"
        value={search}
      />
      <Search />
    </div>
  );
}

export default SearchBar;

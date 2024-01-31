import React from "react";
import Search from "@client/components/svgs/Search";

type Props = {
  search: string;
  onChange: (event: any) => void;
};

function SearchBar({ search, onChange }: Props) {
  return (
    <div className="flex justify-between font-poppins items-center px-3 py-1 gap-x-4 rounded-lg bg-primary-black text-white w-full min-w-0">
      <input
        className="bg-transparent outline-none text-white placeholder:text-sm placeholder:font-jost flex w-[90%]"
        onChange={onChange}
        placeholder="Search"
        type="text"
        value={search}
      />
      <Search />
    </div>
  );
}

export default SearchBar;

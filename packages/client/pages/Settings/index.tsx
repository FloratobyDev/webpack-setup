import React from "react";
import SearchBar from "@client/components/searchbar/SearchBar";

function Settings() {
  return (
    <div className="w-full flex bg-red-200">
      <div className="bg-orange-200 flex-1" />
      <div className="basis-[16.5%] bg-blue-300">
        <div className="flex gap-x-20">
          <p>Settings</p>
          <SearchBar search="" onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default Settings;

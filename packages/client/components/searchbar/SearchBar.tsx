import React, { useRef, useState } from "react";
import Search from "@client/components/svgs/Search";
import useOutsideClick from "@client/hooks/useOutsideClick";
import classNames from "classnames";

type Props = {
  search: string;
  onChange: (event: any) => void;
  show?: boolean;
  className?: string;
  invert?: boolean;
};

function SearchBar({ search, onChange, show, invert, className }: Props) {
  const [showSearch, setShowSearch] = useState(show);
  const divRef = useRef(null);

  useOutsideClick(divRef, showSearch, () => {
    if (!show) {
      setShowSearch(false);
    }
  });

  const divClasses = classNames(
    "flex items-center px-3 gap-x-4 rounded-smd text-white",
    { "bg-primary-black": !invert, "bg-black-75": invert },
    className,
  );

  return (
    <div
      className={divClasses}
      onBlur={() => {
        setShowSearch(false);
      }}
      ref={divRef}
    >
      {(show || showSearch) && (
        <input
          className="bg-transparent outline-none text-paragraph placeholder:text-paragraph placeholder:text-sm flex w-[90%] h-full"
          onChange={onChange}
          placeholder="Search"
          type="text"
          value={search}
        />
      )}
      <div
        onClick={() => {
          setShowSearch(!showSearch);
        }}
      >
        <Search />
      </div>
    </div>
  );
}

export default SearchBar;

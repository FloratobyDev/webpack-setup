import Book from "../svgs/Book";
import Button from "../buttons/Button";
import { Pages } from "@client/types";
import React from "react";
import Settings from "../svgs/Settings";

type Props = {
  activeLink: string;
  onChange: (page: string) => void;
};

function NavBar({ activeLink, onChange }: Props) {
  const links = [
    {
      icon: <Book />,
      page: Pages.JOURNAL,
    },
    {
      icon: <Settings />,
      page: Pages.SETTINGS,
    },
  ];

  return (
    <div className="h-full inline-flex px-2 py-4 flex-col justify-between dark:bg-black-75 rounded-md">
      <div className="flex flex-col gap-y-1 w-full">
        {links.map(({ icon, page }) => (
          <Button
            active={activeLink === page}
            iconSvg={icon}
            key={page}
            onClick={() => onChange(page)}
          />
        ))}
      </div>
    </div>
  );
}

export default NavBar;

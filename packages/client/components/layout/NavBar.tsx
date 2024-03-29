import React, { useState } from "react";
import Book from "../svgs/Book";
import LinkButton from "../buttons/LinkButton";
import { Pages } from "@client/types";
import Settings from "../svgs/Settings";

function NavBar() {
  const [activeLink, setActiveLink] = useState(Pages.JOURNAL);
  // const navigate = useNavigate();
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

  function onChange(page: string) {
    setActiveLink(page);
  }

  return (
    <div className="h-full inline-flex px-2 py-4 flex-col justify-between dark:bg-black-75 border-r border-r-primary-outline">
      <div className="flex flex-col gap-y-1 w-full">
        {links.map(({ icon, page }) => (
          <LinkButton
            active={activeLink === page}
            iconSvg={icon}
            key={page}
            onClick={() => onChange(page)}
            page={page}
          />
        ))}
      </div>
    </div>
  );
}

export default NavBar;

import Journal from "./Journal";
import { Pages } from "@client/types";
import React from "react";
import Settings from "./Settings";

type Props = {
  activeLink: string;
};

function MainPage({ activeLink }: Props) {
  const links = [
    {
      jsx: <Journal key="journal" />,
      page: Pages.JOURNAL,
      id: "journal",
    },
    {
      jsx: <Settings key="settings" />,
      page: Pages.SETTINGS,
      id: "settings",
    },
  ];
  return <>{links.map(({ jsx, page }) => activeLink === page && jsx)}</>;
}

export default MainPage;

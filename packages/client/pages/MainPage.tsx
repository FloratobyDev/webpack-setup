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
      jsx: <Journal />,
      page: Pages.JOURNAL,
    },
    {
      jsx: <Settings />,
      page: Pages.SETTINGS,
    },
  ];
  return <>{links.map(({ jsx, page }) => activeLink === page && jsx)}</>;
}

export default MainPage;

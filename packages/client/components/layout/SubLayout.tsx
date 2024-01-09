import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  transparent?: boolean;
  classnames?: string;
};

function SubLayout({ transparent, children, classnames }: Props) {
  const subLayoutClasses = classNames(
    " max-h-full h-full w-full inline-flex px-2 py-4 flex-col rounded-md",
    {
      "dark:bg-black-75 shadow-md": !transparent,
      "dark:bg-transparent": transparent,
    },
    classnames,
  );
  return <div className={subLayoutClasses}>{children}</div>;
}

export default SubLayout;

import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  transparent?: boolean;
  classnames?: string;
  style?: React.CSSProperties;
};

function SubLayout({ transparent, children, classnames, style }: Props) {
  const subLayoutClasses = classNames(
    " max-h-full h-full w-full inline-flex flex-col rounded-md",
    {
      "dark:bg-black-75 shadow-md": !transparent,
      "dark:bg-transparent": transparent,
    },
    classnames,
  );
  return (
    <div className={subLayoutClasses} style={style}>
      {children}
    </div>
  );
}

export default SubLayout;

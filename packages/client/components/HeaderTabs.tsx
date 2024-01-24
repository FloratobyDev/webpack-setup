import classNames from "classnames";
import { map } from "lodash";
import React from "react";

type Props<T> = {
  options: Array<T>;
  activeValues: T;
  handleValueChange: (value: T) => void;
};

function HeaderTabs<T>({ options, activeValues, handleValueChange }: Props<T>) {
  console.log(
    "options",
    options,
    "activeValues",
    activeValues,
    "handleValueChange",
    handleValueChange,
  );

  return (
    <div className="flex items-center">
      {map(options, (tab) => {
        const buttonClass = classNames(
          "flex-1 p-1 px-3 mx-1 rounded-full grow-0 whitespace-nowrap",
          {
            "bg-black": tab === activeValues,
            "bg-gray-500": tab !== activeValues,
          },
        );
        return (
          <button
            className={buttonClass}
            data-testid={`${tab}-tab`}
            key={tab.toString()}
            onClick={() => handleValueChange(tab)}
          >
            {tab.toString()}
          </button>
        );
      })}
    </div>
  );
}

export default HeaderTabs;

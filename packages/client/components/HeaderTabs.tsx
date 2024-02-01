import classNames from "classnames";
import { map } from "lodash";
import React from "react";

type Props<T> = {
  options: Array<T>;
  activeValues: T;
  handleValueChange: (value: T) => void;
};

function HeaderTabs<T>({ options, activeValues, handleValueChange }: Props<T>) {

  return (
    <div className="flex items-center">
      {map(options, (tab) => {
        const buttonClass = classNames(
          "flex-1 px-4 py-1.5 mx-0.5 rounded-md grow-0 whitespace-nowrap font-poppins font-bold",
          {
            "bg-primary-black": tab === activeValues,
          //   "bg-gray-500": tab !== activeValues,
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

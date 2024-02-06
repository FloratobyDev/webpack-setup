import classNames from "classnames";
import { map } from "lodash";
import React from "react";

type Props<T> = {
  options: Array<T>;
  activeValues: T;
  invertColor?: boolean;
  handleValueChange: (value: T) => void;
};

function HeaderTabs<T>({
  options,
  activeValues,
  handleValueChange,
  invertColor,
}: Props<T>) {
  return (
    <div className="flex items-center">
      {map(options, (tab) => {
        const buttonClass = classNames(
          "flex-1 px-3 mx-0.5 py-1.5 rounded-md grow-0 whitespace-nowrap border border-transparent text-sm",
          {
            "bg-primary-black": tab === activeValues && !invertColor,
            "bg-black-75": invertColor && tab === activeValues,
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

import React from "react";

type Props = {
  black?: boolean;
};

function RotatedCross({ black }: Props) {
  const crossColor = black ? "#FFFFFF" : "#232323";
  return (
    <svg
      fill="none"
      height="10"
      viewBox="0 0 9 10"
      width="9"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M8.36842 2.56431C8.75894 2.17379 8.75894 1.54062 8.36842 1.1501C7.97789 0.759572 7.34473 0.759572 6.95421 1.1501L4.45659 3.64771L1.84223 1.03335C1.4517 0.642827 0.818537 0.642828 0.428013 1.03335C0.0374885 1.42388 0.0374881 2.05704 0.428013 2.44757L3.04237 5.06193L0.590244 7.51406C0.199719 7.90458 0.19972 8.53775 0.590244 8.92827C0.980768 9.31879 1.61393 9.31879 2.00446 8.92827L4.45659 6.47614L6.79197 8.81153C7.1825 9.20205 7.81566 9.20205 8.20619 8.81153C8.59671 8.421 8.59671 7.78784 8.20619 7.39731L5.8708 5.06193L8.36842 2.56431Z"
        fill={crossColor}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default RotatedCross;

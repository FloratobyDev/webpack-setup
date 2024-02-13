/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { H3 } from "@client/components/headings";

type Props = {
  onChange: (date: string) => void;
};

function generateCalendar(year, month) {
  const firstDayOfMonth = dayjs(`${year}-${month}-01`).day();
  const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
  const calendar = [];
  let week = [];

  // Fill the first week with empty days if needed
  for (let i = 0; i < firstDayOfMonth; i += 1) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    week.push({
      day,
      isWeekend:
        dayjs(`${year}-${month}-${day}`).day() === 0 ||
        dayjs(`${year}-${month}-${day}`).day() === 6,
    });

    if (week.length === 7 || day === daysInMonth) {
      calendar.push(week);
      week = [];
    }
  }

  return calendar;
}

function Calendar({ onChange }: Props) {
  const [date, setDate] = useState(dayjs());
  const [month, setMonth] = useState(dayjs());

  const goToPreviousMonth = () => {
    setMonth((currentDate) => currentDate.subtract(1, "month"));
  };

  // Go to next month
  const goToNextMonth = () => {
    setMonth((currentDate) => currentDate.add(1, "month"));
  };

  const calendarData = useMemo(
    () => generateCalendar(month.year(), month.month() + 1),
    [month],
  );

  return (
    <div className="bg-primary-black w-full flex flex-col text-center rounded-md px-2 pb-4 pt-3 border border-primary-outline">
      <p className="text-sm font-extrabold mb-1">{month.format("YYYY")}</p>
      <div className="w-full flex justify-between px-4">
        <button onClick={goToPreviousMonth}>
          <svg
            fill="none"
            height="10"
            viewBox="0 0 8 10"
            width="8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M4.54692 9.22066C5.86627 10.2029 7.74127 9.26127 7.74127 7.61643L7.74127 2.94722C7.74127 1.30238 5.86627 0.360739 4.54693 1.34299L1.41112 3.6776C0.336918 4.47735 0.336917 6.0863 1.41112 6.88605L4.54692 9.22066Z"
              fill="#F0F0F0"
              fillRule="evenodd"
            />
          </svg>
        </button>
        <H3 classname="text-paragraph text-sm font-extrabold uppercase">
          {month.format("MMMM")}
        </H3>
        <button onClick={goToNextMonth}>
          <svg
            fill="none"
            height="10"
            viewBox="0 0 8 10"
            width="8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M3.93355 1.34282C2.6142 0.360566 0.739199 1.3022 0.739199 2.94704L0.739198 7.61625C0.739198 9.26109 2.61419 10.2027 3.93354 9.22048L7.06935 6.88588C8.14355 6.08613 8.14355 4.47717 7.06935 3.67743L3.93355 1.34282Z"
              fill="#F0F0F0"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-y-3 mt-2">
        <div className="grid grid-cols-7 items-center justify-center text-center text-sm text-black-50 font-extrabold">
          <p>S</p>
          <p>M</p>
          <p>T</p>
          <p>W</p>
          <p>T</p>
          <p>F</p>
          <p>S</p>
        </div>
        {calendarData.map((week, weekIndex) => (
          <div className="grid grid-cols-7" key={weekIndex}>
            {week.map((dayInfo, dayIndex) => {
              const isSelectedDate =
                date.format("YYYY-M-D") ===
                `${month.year()}-${month.month() + 1}-${dayInfo?.day}`;
              return (
                <div
                  className={classNames(
                    "h-5 w-5 rounded-sm mx-auto flex items-center justify-center hover:text-primary-black hover:bg-paragraph cursor-pointer",
                    {
                      invisible: !dayInfo,
                      "bg-paragraph text-primary-black": isSelectedDate,
                      "text-paragraph": !isSelectedDate,
                    },
                  )}
                  key={dayIndex}
                  onClick={() => {
                    const selectedDate = dayjs(
                      `${month.year()}-${month.month() + 1}-${dayInfo?.day}`,
                    );

                    onChange(dayjs(selectedDate).format("YYYY-MM-DD"));
                    setDate(selectedDate);
                  }}
                >
                  <p className="text-sm">{dayInfo?.day}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;

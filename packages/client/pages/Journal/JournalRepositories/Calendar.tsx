/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { H3 } from "@client/components/headings";
import { useFetchCalendarDatesByMonthQuery } from "@client/store";

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

function Calendar() {
  const [date, setDate] = useState(dayjs());
  // const [calendarData, setCalendar] = useState(generateCalendar(2024, 3));
  const [highlightedDates, setHighlightedDates] = useState([]); // Example dates

  const {
    data: calendarDates,
    isLoading: isCalendarLoading,
    isError: isCalendarError,
  } = useFetchCalendarDatesByMonthQuery(dayjs().month().toString());

  useEffect(() => {
    if (calendarDates) {
      setHighlightedDates(calendarDates);
    }
  }, [calendarDates]);

  const calendarData = useMemo(
    () => generateCalendar(date.year(), date.month() + 1),
    [date],
  );

  console.log("calendarData", calendarData);

  const goToPreviousMonth = () => {
    setDate((currentDate) => currentDate.subtract(1, "month"));
  };

  // Go to next month
  const goToNextMonth = () => {
    setDate((currentDate) => currentDate.add(1, "month"));
  };

  const isDateHighlighted = (dayObj: any) => {
    const currentMonthAndYearWithDay = dayjs(
      `${date.year()}-${date.month() + 1}-${dayObj.day}`,
    ).format("YYYY-MM-DD");

    const isHighlighted = calendarDates.includes(currentMonthAndYearWithDay);
    return isHighlighted;
  };

  if (isCalendarLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-primary-black w-full flex flex-col text-center rounded-md px-2 py-4">
      <p className="text-sm font-bold font-jost mb-1">{date.format("YYYY")}</p>
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
              fill="#DFB626"
              fillRule="evenodd"
            />
          </svg>
        </button>
        <H3 classname="text-primary-yellow font-extrabold text-sm uppercase">{date.format("MMMM")}</H3>
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
              fill="#DFB626"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-y-3 mt-2">
        <div className="grid grid-cols-7 items-center justify-center text-center text-sm text-black-50 font-jost font-semibold">
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
            {week.map((day, dayIndex) => (
              <div
                className={classNames("h-5 w-5 rounded-[4px] mx-auto", {
                  "bg-primary-yellow": day && isDateHighlighted(day),
                  "bg-black-50": day && !isDateHighlighted(day),
                  invisible: !day,
                })}
                key={dayIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;

import React, { useMemo, useState } from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { H3 } from "@client/components/headings";

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
  const [highlightedDates, setHighlightedDates] = useState([
    "2024-01-04",
    "2024-01-02",
  ]); // Example dates
  const calendarData = useMemo(
    () => generateCalendar(date.year(), date.month() + 1),
    [date]
  );

  const goToPreviousMonth = () => {
    setDate((currentDate) => currentDate.subtract(1, "month"));
  };

  // Go to next month
  const goToNextMonth = () => {
    setDate((currentDate) => currentDate.add(1, "month"));
  };

  const isDateHighlighted = (year, month, day) => {
    const dateStr = dayjs(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`
    ).format("YYYY-MM-DD");
    return highlightedDates.includes(dateStr);
  };

  return (
    <div className="bg-gray-600 w-full flex flex-col text-center rounded-md px-2 py-4">
      <H3>{date.format("MMMM")}</H3>
      <p>{date.format("YYYY")}</p>
      <div className="w-full flex justify-between px-2">
        <button onClick={goToPreviousMonth}>{"<<"}</button>
        {/* Display current month and year */}
        <button onClick={goToNextMonth}>{">>"}</button>
      </div>
      <div className="flex flex-col gap-y-2 mt-2">
        <div className="grid grid-cols-7 items-center justify-center text-center">
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
                className={classNames("h-4 w-4 rounded-md mx-auto", {
                  "bg-yellow-200":
                    day &&
                    isDateHighlighted(date.year(), date.month() + 1, day.day),
                  "bg-gray-200":
                    day &&
                    !isDateHighlighted(date.year(), date.month() + 1, day.day),
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

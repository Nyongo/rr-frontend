import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateSelectProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  className?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DateSelect({
  value,
  onChange,
  minYear = 1900,
  maxYear,
  disabled = false,
  className,
}: DateSelectProps) {
  const currentYear = new Date().getFullYear();
  const defaultMaxYear = maxYear || currentYear - 2; // Default to 2 years ago

  const [selectedDay, setSelectedDay] = React.useState<number | null>(
    value ? value.getDate() : null
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(
    value ? value.getMonth() + 1 : null
  );
  const [selectedYear, setSelectedYear] = React.useState<number | null>(
    value ? value.getFullYear() : null
  );

  // Generate year options
  const years = React.useMemo(() => {
    const yearList = [];
    for (let year = defaultMaxYear; year >= minYear; year--) {
      yearList.push(year);
    }
    return yearList;
  }, [minYear, defaultMaxYear]);

  // Generate month options
  const months = React.useMemo(() => {
    return MONTHS.map((month, index) => ({
      value: index + 1,
      label: month,
    }));
  }, []);

  // Generate day options based on selected month and year
  const days = React.useMemo(() => {
    if (!selectedMonth || !selectedYear) {
      return [];
    }

    // Get the number of days in the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dayList = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dayList.push(day);
    }
    return dayList;
  }, [selectedMonth, selectedYear]);

  // Update the date when any part changes
  React.useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      // Validate the date (check if it's valid)
      if (
        newDate.getDate() === selectedDay &&
        newDate.getMonth() === selectedMonth - 1 &&
        newDate.getFullYear() === selectedYear
      ) {
        onChange(newDate);
      }
    } else {
      onChange(null);
    }
  }, [selectedDay, selectedMonth, selectedYear, onChange]);

  // Sync with external value changes
  React.useEffect(() => {
    if (value) {
      setSelectedDay(value.getDate());
      setSelectedMonth(value.getMonth() + 1);
      setSelectedYear(value.getFullYear());
    } else {
      setSelectedDay(null);
      setSelectedMonth(null);
      setSelectedYear(null);
    }
  }, [value]);

  // Adjust day if it's invalid for the selected month/year
  React.useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      if (selectedDay > daysInMonth) {
        setSelectedDay(daysInMonth);
      }
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  return (
    <div className={`flex gap-2 items-end ${className || ""}`}>
      <div className="flex-1 space-y-2">
        <Label htmlFor="year-select" className="text-xs text-muted-foreground">
          Year
        </Label>
        <Select
          value={selectedYear?.toString() || ""}
          onValueChange={(val) => {
            setSelectedYear(val ? parseInt(val) : null);
            // Reset day and month when year changes
            setSelectedDay(null);
            setSelectedMonth(null);
          }}
          disabled={disabled}
        >
          <SelectTrigger id="year-select">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="month-select" className="text-xs text-muted-foreground">
          Month
        </Label>
        <Select
          value={selectedMonth?.toString() || ""}
          onValueChange={(val) => {
            setSelectedMonth(val ? parseInt(val) : null);
            // Reset day when month changes
            setSelectedDay(null);
          }}
          disabled={disabled || !selectedYear}
        >
          <SelectTrigger id="month-select">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="day-select" className="text-xs text-muted-foreground">
          Day
        </Label>
        <Select
          value={selectedDay?.toString() || ""}
          onValueChange={(val) => setSelectedDay(val ? parseInt(val) : null)}
          disabled={disabled || !selectedMonth || !selectedYear}
        >
          <SelectTrigger id="day-select">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


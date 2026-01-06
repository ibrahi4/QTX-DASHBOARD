/* eslint-disable react/prop-types */
import { Calendar } from "react-multi-date-picker";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

import { FaCalendarAlt } from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";
import { useTheme } from "../theme-provider";

const DateInput = ({
  onChange,
  value,
  placeholder,
  disabled,
  min,
  max,
  noPast,
  noIcons,
  triggerClassName,
}) => {
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const handleReset = () => {
    setDate("");
  };
  useEffect(() => {
    if (value) {
      const { year, month, day } = value;
      const newDate = format(new Date(year, month.index, day), "yyyy/MM/dd");
      setDate(newDate);
      setIsOpen(false);
    }
  }, [value]);

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          className="w-full disabled:!bg-transparent  disabled:!text-inherit"
          disabled={disabled}
        >
          <div
            className={`flex dark:text-white items-center w-full gap-2 px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm cursor-pointer focus-within:border-black h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-inputBorders ${triggerClassName}`}
          >
            {!noIcons && <FaCalendarAlt className="text-[#3872FAA1]" />}
            <input
              type={"text"}
              value={date || ""}
              placeholder={placeholder}
              className={
                "bg-transparent  focus-visible:outline-none w-full placeholder:dark:text-gray-400"
              }
              disabled={disabled}
              readOnly
            />
            {!noIcons && <GoTriangleDown className="dark:text-white" />}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            onChange={onChange}
            value={value || ""}
            className={`!shadow-none dark:!bg-transparent ${
              theme === "dark" ? "bg-dark" : ""
            }`}
            minDate={noPast ? new Date() : min ? min : null}
            maxDate={max ? max : null}
          />
          <button
            onClick={handleReset}
            className="w-full h-10 px-4 py-2 text-center transition-colors rounded-lg hover:bg-accent"
          >
            Reset
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateInput;

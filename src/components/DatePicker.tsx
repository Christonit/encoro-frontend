import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import { LuCalendarDays } from "react-icons/lu";
import { useWindow } from "@/hooks";
import { es } from "date-fns/locale/es";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Button } from "@/components/ui/button";

type GenericI = {
  [key: string]: any;
  handleDateChange?: Function;
  seletedDate?: Date;
  isForm?: boolean;
  appearance?: "default" | "button" | "form" | "filter";
};

export const DatePicker = ({
  className,
  handleDateChange = () => {},
  seletedDate,
  appearance,
}: GenericI) => {
  const [open, openCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { windowWidth, resolution } = useWindow();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      openCalendar(false);
    }
  };

  useEffect(() => {
    console.log("the calendar is open", open);
    if (windowWidth > resolution["md"]) {
      if (open) {
        setTimeout(() => {
          document.addEventListener("click", handleClickOutside);
        }, 200);
      }
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [open, windowWidth]);

  return (
    <div
      className={cn("relative", className, {
        "date-picker-form": appearance === "form",
      })}
    >
      <Button
        variant="clear"
        onClick={() => openCalendar(true)}
        className={cn(
          "flex flex-row  justify-start gap-[8px]  !overflow-hidden  font-normal px-[12px] py-0 border-0  w-full h-full",
          {
            " pl-[52px]": appearance === "form",
            "bg-slate-100 min-h-8 rounded-full border border-slate-100 hover:border-slate-500  box-border leading-normal":
              appearance === "button" || appearance === "filter",
            "rounded-[6px]": appearance !== "filter",
          }
        )}
      >
        {appearance === "form" ? (
          <span className="absolute rounded-tl-[6px] rounded-bl-[6px] top-0 bottom-0 my-auto px-[8px] py-[8px]  w-[40px] flex items-center  left-0">
            <LuCalendarDays size={20} />
          </span>
        ) : (
          <LuCalendarDays
            size={appearance === "filter" ? 16 : 20}
            width={appearance === "filter" ? 16 : 20}
            height={appearance === "filter" ? 16 : 20}
            className={cn({
              "text-slate-500 min-w-4 min-h-4": appearance === "filter",
            })}
          />
        )}
        {seletedDate ? (
          <span
            className={cn("capitalize", {
              "text-sm text-slate-900": appearance === "filter",
            })}
          >
            {dayjs(seletedDate).format(
              appearance === "filter" ? "DD MMMM" : "MMMM DD, YYYY"
            )}
          </span>
        ) : (
          <span
            className={cn({
              "text-slate-500 leading-none": appearance === "filter",
              "text-slate-200 font-regular text-base ": appearance !== "filter",
            })}
          >
            {appearance === "filter" ? "Fecha" : "Selecciona una fecha"}
          </span>
        )}
      </Button>

      {seletedDate && (
        <Button
          onClick={() => {
            handleDateChange(undefined);
          }}
          variant="ghost"
          className={cn(
            "px-0 py-0 h-6 min-w-6   flex items-center absolute  bottom-[0] top-[0] my-auto border-0",
            {
              "right-[4px]": appearance !== "form",
              "right-0": appearance === "form",
              "bg-slate-100 text-slate-500 hover:text-slate-900":
                appearance === "filter",
            }
          )}
        >
          <AiOutlineCloseCircle
            size={appearance === "filter" ? 16 : 20}
            width={appearance === "filter" ? 16 : 20}
            height={appearance === "filter" ? 16 : 20}
            className={cn({
              "min-w-4 min-h-4": appearance === "filter",
            })}
          />
        </Button>
      )}

      {open && (
        <div
          ref={calendarRef}
          className={cn(
            "absolute z-50 mt-2 left-0 bg-white rounded-xl shadow-lg border border-slate-200 date-picker-dropdown",
            "date-picker"
          )}
          // style={{ minWidth: 320 }}
        >
          <DayPicker
            animate
            locale={es}
            mode="single"
            selected={seletedDate}
            disabled={[{ before: new Date() }]}
            onSelect={(val) => {
              handleDateChange(val);
              openCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

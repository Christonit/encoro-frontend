import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale/es";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import dayjs from "dayjs";
import { LuCalendarDays } from "react-icons/lu";
import { useWindow } from "@/hooks";

type GenericI = {
  [key: string]: any;
  handleDateChange?: Function;
  seletedDate?: Date;
  isForm?: boolean;
};

export const DatePicker = ({
  className,
  handleDateChange = () => {},
  seletedDate,
  isForm,
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
      className={cn(className, {
        "date-picker-form": isForm,
      })}
    >
      <Button
        variant="outline-secondary"
        onClick={() => openCalendar(true)}
        className={cn(
          "flex flex-row  items-center gap-[8px]  !overflow-hidden !hover:bg-red-100 !rounded-[6px] font-normal px-[12px] py-0 border-0  w-full h-full",
          {
            " pl-[52px]": isForm,
          }
        )}
      >
        {isForm ? (
          <span className="absolute rounded-tl-[6px] rounded-bl-[6px] top-0 bottom-0 my-auto px-[8px] py-[8px] bg-slate-100  w-[40px] flex items-center justify-center left-0">
            <LuCalendarDays size={20} />
          </span>
        ) : (
          <LuCalendarDays size={20} />
        )}
        {seletedDate ? (
          <span className="capitalize">
            {dayjs(seletedDate).format("MMMM DD, YYYY")}
          </span>
        ) : (
          <span className="text-slate-200 font-regular text-base ">
            Selecciona una fecha
          </span>
        )}
      </Button>

      {seletedDate && (
        <Button
          onClick={() => {
            handleDateChange(undefined);
          }}
          variant="link"
          className={cn(
            "px-0 py-0 h-[32px] min-w-[32px] justify-center  flex items-center absolute  bottom-[0] top-[0] my-auto border-0",
            { "right-[4px]": !isForm, "right-0": isForm }
          )}
        >
          <AiOutlineCloseCircle size={20} />
        </Button>
      )}

      {windowWidth > resolution["md"] && open ? (
        <div ref={calendarRef} className={cn("date-picker")}>
          <DayPicker
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
      ) : (
        <Dialog open={open} onOpenChange={() => openCalendar(false)}>
          <DialogContent>
            <DialogHeader className="border-b-[1px] border-solid border-slate-200 ">
              <h3 className="text-center w-full text-xl font-semibold text-slate-700 mb-0">
                Selecciona una fecha
              </h3>
            </DialogHeader>
            <div className="py-0">
              <DayPicker
                className=""
                locale={es}
                mode="single"
                selected={seletedDate}
                disabled={[{ before: new Date() }]}
                onSelect={async (val) => {
                  console.log({ val });
                  handleDateChange(val);
                  openCalendar(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

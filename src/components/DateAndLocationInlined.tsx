import SearchForCity from "./location/SearchCity";
import { DatePicker } from "./DatePicker";
import { forwardRef, ForwardedRef, useState, useEffect, useRef } from "react";
import { useEvents } from "../context/events";
import { All_PLACES } from "../../utils";

import { LuSearch, LuArrowLeft } from "react-icons/lu";
import cx from "classnames";
import dayjs from "dayjs";
import { EventSearchResultType } from "../interfaces";
import debounce from "lodash/debounce";
import SearchResultItem from "./SearchResultItem";
import { useWindow } from "@/hooks";
import { Button } from "./ui/button";
import { useRouter } from "next/router";

dayjs.locale("es-do");

type DateLocationFilter = {
  selectedDay?: Date;
  handleDateChange: (date: Date) => void;
  handleLocationChange?: (prop: any) => void;
  handleOnSearch: ({ q, city }: { q: string; city?: string }) => void;
  searchResults?: EventSearchResultType[];
  isOnHeader?: boolean;
  defaultCity?: string;
};

const DateLocationSearchComponent = forwardRef(
  (
    {
      handleDateChange,
      selectedDay,
      handleOnSearch,
      searchResults,
      isOnHeader = true,
      handleLocationChange,
      defaultCity,
    }: DateLocationFilter,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const router = useRouter();
    const { location, setLocation, availableCities } = useEvents();
    const [showClearFilter, toggleClearFilter] = useState(false);
    const [showSearch, toggleSearch] = useState(false);
    const [defaultValue, setDefaultValue] = useState(defaultCity ?? "");
    const searchInput = useRef<HTMLInputElement>(null);

    const clearLocation = () => {
      const session_location = localStorage.getItem("location");

      if (session_location) {
        setLocation(JSON.parse(session_location));
        toggleClearFilter(false);
      }

      if (!isOnHeader) {
        const element = document.querySelector(".header-location-input input");
        if (element) {
          handleLocationChange?.({});

          setTimeout(() => {
            (element as HTMLInputElement).value = "";
            const event = new Event("input", {
              bubbles: true,
              cancelable: true,
            });
            element.dispatchEvent(event);
          }, 10);
        }
      }
    };

    useEffect(() => {
      setDefaultValue(
        location && !location.cloud_lookup ? location.city : All_PLACES
      );
    }, [location]);

    const debouncedHandleSearch = debounce((value: string) => {
      if (value.length >= 4) {
        handleOnSearch({ q: value });
      }
    }, 500);

    useEffect(() => {
      console.log("router.query", router.query);
    }, [router.query]);
    useEffect(() => {
      return () => {
        debouncedHandleSearch.cancel();
      };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedHandleSearch(value);
    };

    const handleToggleSearch = () => {
      if (showSearch) {
        toggleSearch(false);
        handleOnSearch({ q: "" });
      } else {
        toggleSearch(true);
      }
    };

    useEffect(() => {
      if (searchInput.current && showSearch) {
        setTimeout(() => {
          searchInput.current!.focus();
          searchInput.current!.selectionStart =
            searchInput.current!.selectionEnd = 10000;
        }, 0);
      }
    }, [searchInput, showSearch]);
    return (
      <div
        ref={ref}
        className={cx(
          "flex flex-col lg:flex-row items-center gap-[12px] lg:!gap-0 max-w-xl w-full lg:min-w-xl border-slate-200 lg:border lg:bg-white relative rounded-[8px]"
        )}
      >
        {showSearch && (
          <div className="flex items-center gap-0 justify-start w-full bg-white rounded-lg border-t border-b border-l border-r border-slate-200 lg:border-t-0 lg:border-b-0 lg:border-l-0 lg:border-r-0">
            <Button
              variant="ghost"
              onClick={handleToggleSearch}
              className="px-0 w-[40px] py-0"
            >
              <LuArrowLeft size={20} />
            </Button>
            <input
              ref={searchInput}
              type="text"
              className="text-base text-slate-900 bg-transparent w-full border-0 focus:outline-none  py-2 px-2"
              placeholder="Que buscas hoy?"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  toggleSearch(false);
                }
              }}
            />
          </div>
        )}
        {!showSearch && (
          <>
            <Button
              className="px-0 py-0 h-[32px] lg:h-[40px] lg:w-[52px] w-full border-l border-r border-t border-b border-neutral-200 lg:border-0"
              variant="ghost-white"
              onClick={handleToggleSearch}
            >
              <LuSearch
                size={20}
                className="text-slate-900 h-[20px] w-[20px]"
              />
              <span className="lg:hidden ml-1">Encontrar eventos</span>
            </Button>
            <div className="grid gap-[12px] lg:!gap-0 lg:grid-cols-2 w-full">
              <div className="border-b lg:border-b-0 border-t lg:border-t-0 border-r w-full border-l border-neutral-200 bg-white lg:bg-transparent rounded-md  lg:rounded-l-none lg:rounded-r-none">
                <SearchForCity
                  citiesList={availableCities}
                  onChangeLocation={(props) => {
                    if (!isOnHeader && handleLocationChange) {
                      handleLocationChange(props);
                    } else {
                      setLocation(props);
                    }
                    toggleClearFilter(true);
                  }}
                  defaultValue={isOnHeader ? defaultValue : defaultCity}
                  className="h-full px-2 "
                  clearLocation={clearLocation}
                  showClearFilter={showClearFilter}
                />
              </div>
              <DatePicker
                className=" w-full  z-[2] relative border-b lg:border-b-0 border-t lg:border-t-0 border-r lg:border-r-0   border-l border-neutral-200 lg:border-l-0 lg:h-[40px]  bg-white lg:bg-transparent rounded-lg lg:rounded-l-none"
                handleDateChange={handleDateChange}
                seletedDate={selectedDay}
              />
            </div>
          </>
        )}

        {showSearch && searchResults && (
          <div className="w-full border-neutral-200 border-[1px] rounded-lg bg-white z-[999] overflow-y-auto max-h-[320px] absolute top-[44px]  left-0">
            {searchResults.length > 0 ? (
              searchResults.map((event, index) => (
                <SearchResultItem key={index} {...event} />
              ))
            ) : (
              <span className="p-[16px]  py-[32px] block text-center text-slate-600 text-base font-semibold text-center">
                No se encontraron resultados.
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

DateLocationSearchComponent.displayName = "DateAndLocationDesktop";

export default DateLocationSearchComponent;

import { useRouter } from "next/router";
import SearchForCity from "./location/SearchCity";
import { DatePicker } from "@/components/DatePicker";
import { forwardRef, ForwardedRef, useState, useEffect, useRef } from "react";
import { useEvents } from "../context/events";
import { All_PLACES } from "@/lib/utils";
import { AiOutlineSearch, AiOutlineArrowLeft } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { EventSearchResultType } from "../interfaces";
import debounce from "lodash/debounce";
import SearchResultItem from "@/components/ui/search-result-item";
import { useWindow } from "@/hooks";

dayjs.locale("es-do");

type DateLocationFilter = {
  selectedDay?: Date;
  handleDateChange: (date: Date) => void;
  handleLocationChange?: (prop: any) => void;
  handleOnSearch: ({ q, city }: { q: string; city?: string }) => void;
  searchResults?: EventSearchResultType[];
  isOnHeader?: boolean;
  isOnHeroBanner?: boolean;
  defaultCity?: string;
};

const DateLocationFilter = forwardRef(
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
    const [showOnlySearch, toggleShowOnlySearch] = useState(false);
    const [showSearch, toggleSearch] = useState(false);
    const [defaultValue, setDefaultValue] = useState(defaultCity ?? "");
    const searchInput = useRef<HTMLInputElement>(null);

    const { windowWidth, resolution } = useWindow();
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
        console.log(value);
        handleOnSearch({ q: value });
      }
    }, 500);

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

    useEffect(() => {
      console.log("HEADER ROUTER", router.pathname);

      const routesWithAllOptions = ["/", "/[category]"];

      if (routesWithAllOptions.includes(router.pathname)) {
        toggleShowOnlySearch(false);
      } else {
        if (!showOnlySearch) {
          toggleShowOnlySearch(true);
        }
      }
    }, [router.pathname, showOnlySearch]);

    return (
      <div
        ref={ref}
        className={cn(
          "top-bar-main-actions flex items-center bg-white border border-slate-300 rounded-xl",
          {
            "border-slate-900": showSearch,
            "absolute ": isOnHeader && windowWidth >= resolution["3xl"],
          }
        )}
      >
        {showOnlySearch ? (
          <div className="flex items-center w-full">
            <Button
              className="px-[8px] py-0 h-[36px] bg-transparent border-0 "
              onClick={handleToggleSearch}
              variant="clear"
            >
              {showSearch ? (
                <AiOutlineArrowLeft size={20} className="text-slate-900" />
              ) : (
                <AiOutlineSearch size={20} className="text-slate-900" />
              )}
            </Button>
            <input
              ref={searchInput}
              type="text"
              className="text-base text-slate-900 w-full border-0 focus:outline-none"
              placeholder="Que buscas hoy?"
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  toggleSearch(false);
                }
              }}
            />
          </div>
        ) : (
          <>
            <Button
              className="px-[8px] py-0 h-[36px] bg-transparent border-0 "
              onClick={handleToggleSearch}
              variant="clear"
            >
              {showSearch ? (
                <AiOutlineArrowLeft size={20} className="text-slate-900" />
              ) : (
                <AiOutlineSearch size={20} className="text-slate-900" />
              )}
            </Button>
            {showSearch ? (
              <input
                ref={searchInput}
                type="text"
                className="text-base text-slate-900 w-full border-0 focus:outline-none"
                placeholder="Que buscas hoy?"
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape") {
                    toggleSearch(false);
                  }
                }}
              />
            ) : (
              <>
                <span className="h-6 w-px bg-slate-300" />
                <div className="top-bar-location-picker flex items-center">
                  <SearchForCity
                    citiesList={availableCities}
                    onChangeLocation={(props) => {
                      if (handleLocationChange) {
                        handleLocationChange(props);
                      }
                      toggleClearFilter(true);
                    }}
                    defaultValue={isOnHeader ? defaultValue : defaultCity}
                    className="header-location-input bg-transparent border-0  text-slate-900 text-lg"
                    clearLocation={clearLocation}
                    showClearFilter={showClearFilter}
                  />
                </div>
                <span className="h-6 w-px bg-slate-300" />
                <DatePicker
                  className="w-full max-w-[240px] min-w-[240px]"
                  handleDateChange={handleDateChange}
                  seletedDate={selectedDay}
                />
              </>
            )}
          </>
        )}

        {showSearch && searchResults && (
          <div className="w-full border-slate-200 border-[1px] rounded-[8px] bg-white z-[999] overflow-y-auto max-h-[320px] absolute top-[40px]  left-0">
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

DateLocationFilter.displayName = "DateAndLocationDesktop";

export default DateLocationFilter;

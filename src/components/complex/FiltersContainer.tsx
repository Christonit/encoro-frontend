import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { FeeFilter, useFilters } from "@/context/filters";
import { cn } from "@/lib/utils";
import { CategoriesRack } from "@/components/CategoriesRack";
import { FeeToggleGroup } from "./FeeToggleGroup";
import { CATEGORIES } from "@/lib/variables";
import { ViewModeToggleGroup } from "./ViewModeToggleGroup";
import { DatePicker } from "@/components/DatePicker";
import dayjs from "dayjs";

export const FiltersContainer = ({
  showPriceFilter = true,
  showViewModeToggle = true,
  useParams = false,
}: {
  showPriceFilter?: boolean;
  showViewModeToggle?: boolean;
  useParams?: boolean;
}) => {
  const {
    priceFilter,
    setPriceFilter,
    displayType,
    setDisplayType,
    eventsCategory,
    handleCategoryPageNavigation,
    scrollDirection,
  } = useFilters();

  const [queryParams, setQueryParams] = useState<{
    category?: string;
    price?: string;
    date?: string;
  }>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  const currentPath = router.pathname;

  useEffect(() => {
    if (useParams) {
      router.push({
        pathname: currentPath,
        query: queryParams,
      });
    }
  }, [queryParams]);

  // Keep queryParams in sync with selectedDate
  useEffect(() => {
    if (useParams) {
      setQueryParams((prev) => {
        if (!selectedDate) {
          // Remove date from params if cleared
          const { date, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          date: dayjs(selectedDate).format("YYYY-MM-DD"),
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    console.log("router.query", router.query);
  }, [router.query]);

  return (
    <div
      id="filters"
      className={cn(
        "filter-header flex flex-col lg:flex-row items-center gap-4 lg:gap-0 w-full bg-white",
        {
          "is-scrolling": scrollDirection === "up",
        }
      )}
    >
      <div className="filter-header-container flex-1 flex items-center gap-4 ">
        <CategoriesRack
          categories={CATEGORIES}
          onClickHandler={(value) => {
            if (!useParams) {
              handleCategoryPageNavigation(value);
            } else {
              setQueryParams({
                ...queryParams,
                category: value,
              });
            }
          }}
          activeCategory={
            useParams ? (queryParams.category as string) : eventsCategory
          }
        />

        <div className="hidden lg:flex ml-auto gap-6 items-center">
          {showPriceFilter && (
            <FeeToggleGroup
              value={useParams ? (queryParams.price as FeeFilter) : priceFilter}
              onChange={(val: string) => {
                const value = val as FeeFilter;
                if (!useParams) {
                  setPriceFilter(value);
                } else {
                  setQueryParams({
                    ...queryParams,
                    price: value,
                  });
                }
              }}
            />
          )}

          {useParams && (
            <DatePicker
              appearance="filter"
              className="z-[100] w-[144px]"
              seletedDate={selectedDate}
              handleDateChange={(value: Date) => {
                console.log("value", value);
                setSelectedDate(value);
                setQueryParams({
                  ...queryParams,
                  date: value
                    ? value.toISOString().slice(0, 19) + "+00:00"
                    : undefined,
                });
              }}
            />
          )}

          {showViewModeToggle && (
            <ViewModeToggleGroup
              value={displayType}
              onChange={setDisplayType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

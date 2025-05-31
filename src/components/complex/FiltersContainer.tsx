import { FeeFilter, useFilters } from "@/context/filters";
import { cn } from "@/lib/utils";
import { CategoriesRack } from "@/components/CategoriesRack";
import { FeeToggleGroup } from "./FeeToggleGroup";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { RiLayoutGridFill } from "react-icons/ri";
import { CATEGORIES } from "@/lib/variables";
import { ViewModeToggleGroup } from "./ViewModeToggleGroup";

export const FiltersContainer = () => {
  const {
    priceFilter,
    setPriceFilter,
    displayType,
    setDisplayType,
    eventsCategory,
    handleCategoryPageNavigation,
    scrollDirection,
  } = useFilters();

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
        <div className="filter-header-container flex-1 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <CategoriesRack
            categories={CATEGORIES}
            onClickHandler={handleCategoryPageNavigation}
            activeCategory={eventsCategory}
          />

          <div className="hidden lg:flex ml-auto gap-6 items-center">
            <FeeToggleGroup value={priceFilter} onChange={(val: string) =>{
                const value  = val as FeeFilter
                setPriceFilter(value)
                }} />

            <ViewModeToggleGroup value={displayType} onChange={setDisplayType} />
          </div>
        </div>
      </div>
  );
};
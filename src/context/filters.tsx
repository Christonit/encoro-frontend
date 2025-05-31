import React, { createContext, useContext, useState, useCallback } from "react";

export type FeeFilter = "all" | "free" | "pay" | "paid";
export type DisplayType = "grid" | "card";

interface FiltersContextType {
  priceFilter: FeeFilter;
  setPriceFilter: (val: FeeFilter) => void;
  displayType: DisplayType;
  setDisplayType: (val: DisplayType) => void;
  eventsCategory: string;
  setEventsCategory: (val: string) => void;
  handleCategoryPageNavigation: (category: string) => void;
  scrollDirection: string;
  setScrollDirection: (val: string) => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceFilter, setPriceFilter] = useState<FeeFilter>("all");
  const [displayType, setDisplayType] = useState<DisplayType>("grid");
  const [eventsCategory, setEventsCategory] = useState<string>("all");
  const [scrollDirection, setScrollDirection] = useState<string>("");

  const handleCategoryPageNavigation = useCallback((category: string) => {
    setEventsCategory(category);
  }, []);

  return (
    <FiltersContext.Provider
      value={{
        priceFilter,
        setPriceFilter,
        displayType,
        setDisplayType,
        eventsCategory,
        setEventsCategory,
        handleCategoryPageNavigation,
        scrollDirection,
        setScrollDirection,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
} 
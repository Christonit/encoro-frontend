import { useRef, useEffect, useState } from "react";
import { ListOfCititesType } from "../../interfaces";
import {
  AiOutlineEnvironment,
  AiFillCaretDown,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AutoCompleteProps = {
  clearLocation: () => void;
  onChangeLocation: (prop: any) => void;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  searchType?: string;
  appearence?: string;
  showClearFilter?: boolean;
  citiesList?: ListOfCititesType[];
  fluid?: boolean;
};

const SearchForCity = ({
  onChangeLocation,
  defaultValue,
  placeholder = "Seleccionar ciudad",
  className = "",
  appearence = "clear",
  showClearFilter,
  clearLocation,
  citiesList,
  fluid = false,
}: AutoCompleteProps) => {
  const [suggestions, setSuggestions] = useState<ListOfCititesType[] | null>(
    null
  );
  const [isOnFocus, setIsOnFocus] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchAddress = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [onFocusDisableClear, setOnFocusDisableClear] = useState(false);
  const searchPlace = debounce(async (e) => {
    const query = e.target.value;
    if (query.length < 3) return;

    const filteredList = citiesList?.filter((item) => {
      return item.city.toLowerCase().includes(query.toLowerCase());
    });

    setSuggestions(filteredList || null);
  }, 300);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      searchAddress.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !searchAddress.current.contains(event.target as Node)
    ) {
      setSuggestions(null); // Hide the suggestions by clearing the state
      setShowOptions(false);
    }
  };

  const handleSelection = (item: ListOfCititesType): void => {
    onChangeLocation({ ...item });
    setSuggestions(null);
    setShowOptions(false);
    setOnFocusDisableClear(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (inputRef.current) {
      inputRef!.current!.value = defaultValue!;
    }
  }, [inputRef, defaultValue]);

  return (
    <div
      className={cn(
        {
          "auto-complete relative w-full": appearence === "clear",
          "form-select p-0": appearence === "primary",
          "bg-slate-100/[.50]": isOnFocus,
        },
        "hover:bg-slate-100/[.50]",
        className
      )}
      ref={searchAddress}
    >
      <div className="flex items-center h-full px-2">
        {appearence === "primary" ? (
          <div className="border-0 h-[36px] rounded-r-none">
            <MdLocationPin size={20} />
          </div>
        ) : (
          <AiOutlineEnvironment className="w-[20px] min-w-[20px]" size={20} />
        )}
        <input
          type="text"
          name="search-city"
          ref={inputRef}
          onClick={() => {
            setShowOptions(true);
          }}
          className={cn(
            " focus:outline-none  bg-transparent h-[32px] py-[8px] px-[8px] text-base text-neutral-900 placeholder:text-slate-200",
            {
              "max-w-[240px] w-full": !fluid && appearence === "clear",
              "w-full": fluid || appearence === "primary",
            }
          )}
          onChange={searchPlace}
          placeholder={placeholder}
          defaultValue={defaultValue && defaultValue !== "" ? defaultValue : ""}
          autoComplete="off"
          onFocus={() => {
            setIsOnFocus(true);
          }}
          onBlur={() => {
            setIsOnFocus(false);
          }}
        />

        {showClearFilter && !onFocusDisableClear && defaultValue !== "" && (
          <Button
            onClick={() => {
              setSuggestions(null);
              clearLocation();
              setOnFocusDisableClear(false);
            }}
            variant="link"
            className="px-0 py-0 h-[32px] min-w-[32px] justify-center  flex items-center absolute right-[4px] border-0"
          >
            <AiOutlineCloseCircle size={20} />
          </Button>
        )}

        {appearence === "primary" ? (
          <AiFillCaretDown
            size={16}
            className="w-[16px] absolute right-[8px] bg-white w-[36px]"
          />
        ) : null}
      </div>
      {showOptions && (
        <div
          ref={dropdownRef}
          className="location-selection-dropdown max-h-[320px] overflow-y-auto -left-[2px] lg:-left-1"
        >
          {citiesList && !suggestions
            ? citiesList.map((item) => {
                return (
                  <button
                    key={item.city_id}
                    className="location-select-item hover:bg-slate-100/[.5]"
                    onClick={() => {
                      handleSelection(item);
                    }}
                  >
                    {item.city}
                  </button>
                );
              })
            : suggestions!.map((item) => (
                <button
                  key={item.city_id}
                  className="location-select-item hover:bg-slate-100/[.5]"
                  onClick={() => {
                    handleSelection(item);
                  }}
                >
                  {item.city}
                </button>
              ))}

          <button
            className="location-select-item hover:bg-slate-100/[.5]"
            onClick={() => {
              handleSelection({
                city_id: "",
                city: "",
              });
            }}
          >
            Todo el pais
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchForCity;

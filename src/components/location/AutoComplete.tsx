import { useRef, useEffect, useState } from "react";
import { GooglePlacesResponseType } from "../../interfaces";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import debounce from "lodash/debounce";
import cx from "classnames";
import AutoCompleteOption from "./AutoCompleteOption";
import { useBackend } from "../../hooks";
import { Input } from "@/components/ui/input";
import { Button as UiButton } from "@/components/ui/button";

type AutoCompleteProps = {
  onChangeLocation: (prop: any) => void;
  clearSearch: () => void;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  displayWarning?: boolean;
};

export const AutoComplete = ({
  onChangeLocation,
  placeholder = "Buscar dirección",
  className = "",
  clearSearch,
  displayWarning,
  defaultValue,
}: AutoCompleteProps) => {
  const [suggestions, setSuggestions] = useState<GooglePlacesResponseType[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchAddress = useRef<HTMLDivElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  const { get } = useBackend();

  const searchPlace = debounce(async (e) => {
    const query = e.target.value;
    if (query.length < 3) return;
    const { data } = await get(`/api/search-location`, {
      params: { input: query },
    });
    setSuggestions(data);
  }, 300);

  const handleClearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      clearSearch();
      setShowOptions(false);
    }
  };

  const getCity = async (place_id: string) => {
    try {
      const { data } = await get(`/api/search-location-by-place-id`, {
        params: { place_id },
      });
      if (data) {
        const { data: cityResult } = await get(`/api/search-location`, {
          params: { input: data.data.long_name, citiesOnly: true },
        });
        if (cityResult) {
          const { id: city_id, name: city, ...res } = cityResult[0];
          return { city_id, city, ...res };
        }
      }
    } catch (e) {
      console.log("Error Getting City", e);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      searchAddress.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !searchAddress.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
      setShowOptions(false);
    }
  };

  const handleSelection = async (item: GooglePlacesResponseType): Promise<void> => {
    if (!item.location) return;
    const { city, city_id } = await getCity(item.id);
    onChangeLocation({ ...item, city, city_id });
    setShowOptions(false);
    inputRef!.current!.value = item.location;
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cx("auto-complete relative w-full", className)}
      ref={searchAddress}
    >
      <div className="flex items-center border border-slate-500 rounded-md bg-white relative">
        <span className="h-[36px] flex items-center px-2 border-r border-slate-500 text-slate-500">
          <MdLocationPin />
        </span>
        <Input
          type="text"
          name="search-city"
          ref={inputRef}
          onClick={() => setShowOptions(true)}
          className="py-1 h-[36px] px-3 w-full focus:outline-none border-0"
          onChange={searchPlace}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowOptions(false);
          }}
        />
        {inputRef.current && inputRef.current.value && (
          <UiButton
            type="button"
            onClick={handleClearSearch}
            variant="ghost"
            className="absolute right-1 text-slate-400 hover:text-slate-900 p-0 h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Limpiar búsqueda"
          >
            <AiOutlineCloseCircle />
          </UiButton>
        )}
      </div>

      {showOptions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="location-selection-dropdown border-slate-200 z-50"
        >
          {suggestions.map((item, i) => (
            <AutoCompleteOption
              key={item.id + i}
              id={item.id + i}
              label={item.location!}
              onClick={() => handleSelection(item)}
            />
          ))}
        </div>
      )}

      {displayWarning && (
        <span className="text-red-500 requiered-warning">
          Indicar una dirección es requerido.
        </span>
      )}
    </div>
  );
};

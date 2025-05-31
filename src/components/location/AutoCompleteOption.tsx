import { useState } from "react";
import { useWindow } from "../../hooks";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AutoCompleteOption = ({
  id,
  label = "",
  onClick,
}: {
  id: string;
  label: string;
  onClick: () => void;
}) => {
  const [show, setShow] = useState(false);
  const { windowWidth, resolution } = useWindow();

  if (windowWidth > resolution.lg && label.length > 64) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="location-select-item w-full text-left px-3 py-2 rounded hover:bg-slate-100 transition"
              onClick={onClick}
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
              onFocus={() => setShow(true)}
              onBlur={() => setShow(false)}
            >
              {label}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <span className="text-sm">{label}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="location-select-item w-full text-left px-3 py-2 rounded hover:bg-slate-100 transition"
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default AutoCompleteOption;

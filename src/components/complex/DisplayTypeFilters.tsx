import { BsFillGrid1X2Fill } from "react-icons/bs";
import { RiLayoutGridFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DisplayTypeFilters = ({
  changeFeeType,
  changeDisplayType,
  shouldShowDisplayToggle,
  className,
}: {
  className?: string;
  shouldShowDisplayToggle?: boolean;
  changeFeeType?: (text: string) => void;
  changeDisplayType?: () => {};
}) => {
  return (
    <div className={`flex ml-auto gap-4 items-center ${className || ""}`}>
      <div className="event-fee-filter-container px-4 ml-auto">
        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-sm font-medium",
              "data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            )}
            onClick={() => changeFeeType?.("all")}
          >
            Todos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-sm font-medium",
              "data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            )}
            onClick={() => changeFeeType?.("free")}
          >
            Gratis
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-sm font-medium",
              "data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900"
            )}
            onClick={() => changeFeeType?.("pay")}
          >
            Pago
          </Button>
        </div>
      </div>
      {shouldShowDisplayToggle && (
        <div className="grid-type-filter-container ml-auto">
          <span className="font-medium"> Modo de visualizacion </span>
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-slate-900",
                "data-[state=active]:bg-slate-100"
              )}
              onClick={() => changeDisplayType?.()}
            >
              <BsFillGrid1X2Fill />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-slate-900",
                "data-[state=active]:bg-slate-100"
              )}
              onClick={() => changeDisplayType?.()}
            >
              <RiLayoutGridFill />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

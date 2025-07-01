import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface FeeToggleGroupProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  labels?: { all?: string; free?: string; pay?: string };
}

export const FeeToggleGroup = ({
  value,
  onChange,
  className = "",
  labels = { all: "Todos", free: "Gratis", pay: "Pago" },
}: FeeToggleGroupProps) => {
  return (
    <div className={cn("event-fee-filter-container flex", className)}>
      <ToggleGroup
        type="single"
        value={value}
        data-togle-name="fee-type-toggle"
        className="flex"
      >
        <ToggleGroupItem
          className={cn(
            "fee-toggle",
            value === "all" && "fee-toggle--active",
            "rounded-l-full"
          )}
          value="all"
          tabIndex={0}
          onClick={() => onChange("all")}
          aria-label={labels.all}
        >
          {labels.all}
        </ToggleGroupItem>
        <ToggleGroupItem
          className={cn(
            "fee-toggle border-x-1 border-slate-300",
            value === "free" && "fee-toggle--active"
          )}
          value="free"
          onClick={() => onChange("free")}
          tabIndex={0}
          aria-label={labels.free}
        >
          {labels.free}
        </ToggleGroupItem>
        <ToggleGroupItem
          onClick={() => onChange("pay")}
          className={cn(
            "fee-toggle",
            value === "pay" && "fee-toggle--active",
            "rounded-r-full"
          )}
          value="pay"
          tabIndex={0}
          aria-label={labels.pay}
        >
          {labels.pay}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

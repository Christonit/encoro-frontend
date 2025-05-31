import { BsFillGrid1X2Fill } from "react-icons/bs";
import { RiLayoutGridFill } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface ViewModeToggleGroupProps {
    value: "grid" | "card";
    onChange: (val: "grid" | "card") => void;
    className?: string;
}

export const ViewModeToggleGroup = ({ value, onChange, className = "" }: ViewModeToggleGroupProps) => {
    return (
        <div className={cn("grid-type-filter-container ml-6", className)}>
            <span className="font-medium">Modo de visualización</span>
            <div className="view-toggle-group flex ">
                <button
                    type="button"
                    className={cn(
                        "view-toggle",
                        value === "grid" && "view-toggle--active"
                    )}
                    aria-label="Vista de grilla"
                    onClick={() => onChange("grid")}
                >
                    <BsFillGrid1X2Fill size={22} />

                </button>
                <button
                    type="button"
                    className={cn(
                        "view-toggle",
                        value === "card" && "view-toggle--active"
                    )}
                    aria-label="Vista de tarjetas"
                    onClick={() => onChange("card")}
                >

                    <RiLayoutGridFill size={22} />

                </button>
            </div>
        </div>
    );
}; 
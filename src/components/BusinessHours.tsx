import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { AiOutlineClockCircle, AiOutlineCalendar } from "react-icons/ai";

const DAYS = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export type BusinessHoursSlot = {
  dayFrom: string;
  dayTo: string;
  hourFrom: string;
  hourTo: string;
};

export default function BusinessHours({
  value,
  onChange,
}: {
  value?: BusinessHoursSlot[];
  onChange?: (slots: BusinessHoursSlot[]) => void;
}) {
  const [slots, setSlots] = useState<BusinessHoursSlot[]>(
    value && value.length > 0
      ? value
      : [{ dayFrom: "", dayTo: "", hourFrom: "", hourTo: "" }]
  );

  const emitChange = (newSlots: BusinessHoursSlot[]) => {
    setSlots(newSlots);
    if (onChange) onChange(newSlots);
  };

  const addSlot = () => {
    emitChange([
      ...slots,
      { dayFrom: "", dayTo: "", hourFrom: "", hourTo: "" },
    ]);
  };

  const removeSlot = (idx: number) => {
    const newSlots = slots.filter((_, i) => i !== idx);
    emitChange(newSlots);
  };

  const updateSlot = (
    idx: number,
    field: keyof BusinessHoursSlot,
    val: string
  ) => {
    const updated = slots.map((slot, i) =>
      i === idx ? { ...slot, [field]: val } : slot
    );
    emitChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {slots.map((slot, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {/* Day range */}
          <div className="flex items-center border rounded-md px-2 py-1 bg-slate-50">
            <AiOutlineCalendar className="mr-1 text-slate-400" />
            <Select
              value={slot.dayFrom}
              onValueChange={(val) => updateSlot(idx, "dayFrom", val)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Desde" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="mx-2">a</span>
            <Select
              value={slot.dayTo}
              onValueChange={(val) => updateSlot(idx, "dayTo", val)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Hasta" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Hour range */}
          <div className="flex items-center border rounded-md px-2 py-1 bg-slate-50">
            <AiOutlineClockCircle className="mr-1 text-slate-400" />
            <Input
              type="time"
              value={slot.hourFrom}
              onChange={(e) => updateSlot(idx, "hourFrom", e.target.value)}
              className="w-20"
              placeholder="Desde"
              required
            />
            <span className="mx-2">a</span>
            <Input
              type="time"
              value={slot.hourTo}
              onChange={(e) => updateSlot(idx, "hourTo", e.target.value)}
              className="w-20"
              placeholder="Hasta"
              required
            />
          </div>
          {/* Remove button */}
          <Button
            type="button"
            variant="outline"
            className="ml-2"
            onClick={() => removeSlot(idx)}
          >
            -
          </Button>
        </div>
      ))}
      {/* Add button */}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        onClick={addSlot}
      >
        + Agregar horario
      </Button>
    </div>
  );
}

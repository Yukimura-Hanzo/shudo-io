"use client";

//? SHADCN UI
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils"; //? helper from shadcn to conditionally join classes

//? TS Types
type FilterName = "All" | "Active" | "Completed";

type FilterButtonProps = {
  name: FilterName;
  isPressed: boolean;
  setFilter: (filterName: FilterName) => void;
};

export default function FilterButton({ name, isPressed, setFilter }: FilterButtonProps) {
  return (
    <ToggleGroupItem
      value={name}
      aria-label={name}
      onClick={() => setFilter(name)}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isPressed
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-black hover:bg-gray-300"
      )}
      data-state={isPressed ? "on" : "off"}
    >
      {name}
    </ToggleGroupItem>
  );
}

// components/ui/FilterDropdown.jsx
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CirclePlus, X } from "lucide-react";

const FilterDropdown = ({
  options = [],          // [{ value, label }]
  selected = [],         // array of selected values
  onToggle,
  onReset,
  heading = "Filter",
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${
              selected.length > 0 ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <CirclePlus size={14} />
            {heading}
          </Button>
        </DropdownMenuTrigger>

        {/* Options */}
        <DropdownMenuContent>
          {options.map((opt) => (
            <DropdownMenuCheckboxItem
              key={String(opt.value)}
              onClick={() => onToggle(opt.value)}
              checked={selected.includes(opt.value)}
              className={
                selected.includes(opt.value)
                  ? "bg-gray-100 font-medium mb-1"
                  : ""
              }
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => (
              <div
                key={String(opt.value)}
                className="group inline-flex items-center gap-1 px-2 py-1 justify-center bg-[#F1F5F9] text-[#0F172A] text-sm rounded-sm"
              >
                {opt.label}
                <X
                  size={14}
                  className="cursor-pointer hover:text-gray-900 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onToggle(opt.value)}
                />
              </div>
            ))}
        </div>
      )}

      {/* Reset */}
      {selected.length > 0 && (
        <div
          className="inline-flex items-center gap-1 px-3 py-1 font-medium text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200"
          onClick={onReset}
        >
          Reset <X size={14} className="ml-1" />
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

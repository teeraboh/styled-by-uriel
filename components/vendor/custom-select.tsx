"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  fullWidth?: boolean;
  triggerClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon: Icon,
  fullWidth = false,
  triggerClassName,
  menuClassName,
  ariaLabel,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", fullWidth && "w-full")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-[#221a16] text-[13px] font-medium shadow-xs hover:bg-[#fceae3] border border-[#f0dfd8] transition-colors",
          fullWidth && "w-full justify-between",
          triggerClassName
        )}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-[#71523c] shrink-0" />}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-[#71523c] shrink-0 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute left-0 top-full mt-2 z-50 w-48 min-w-[160px] max-w-[90vw] sm:min-w-[15rem] max-h-[60vh] overflow-y-auto rounded-xl bg-white shadow-xl border border-[#f0dfd8] p-1.5 animate-in fade-in zoom-in-95 duration-150",
            menuClassName
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2",
                    isSelected
                      ? "bg-[#fff1eb] text-[#221a16]"
                      : "text-[#50453e] hover:bg-[#fedab1] hover:text-[#221a16]"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#71523c] shrink-0 ml-auto" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
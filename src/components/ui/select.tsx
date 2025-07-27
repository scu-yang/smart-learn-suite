"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, onOpenChange: setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  const { open, onOpenChange } = useSelectContext();

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext();
  return <span>{value || placeholder}</span>;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white py-1 shadow-lg",
        "max-h-60 overflow-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange, onOpenChange } = useSelectContext();
  const isSelected = selectedValue === value;

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none",
        "hover:bg-gray-100 focus:bg-gray-100",
        isSelected && "bg-blue-50 text-blue-900",
        className
      )}
      onClick={() => {
        onValueChange?.(value);
        onOpenChange(false);
      }}
    >
      <span className="block truncate">{children}</span>
      {isSelected && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Check className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

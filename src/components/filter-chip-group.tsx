"use client";

import type { ReactNode } from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterChipGroupProps<T extends string> = {
  label?: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  getLabel: (value: T) => string;
  getIcon?: (value: T, active: boolean) => ReactNode;
  getIconTint?: (value: T) => string;
  size?: "default" | "large";
  selectAllLabel?: string;
  onSelectAll?: () => void;
  onClearAll?: () => void;
};

export function FilterChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  getLabel,
  getIcon,
  getIconTint,
  size = "default",
  selectAllLabel,
  onSelectAll,
  onClearAll,
}: FilterChipGroupProps<T>) {
  const isLarge = size === "large";
  const allSelected =
    options.length > 0 && options.every((option) => selected.includes(option));

  const selectAllButton =
    selectAllLabel && onSelectAll && onClearAll ? (
      <Button
        type="button"
        size={isLarge ? "lg" : "sm"}
        variant={allSelected ? "default" : "outline"}
        className={cn(
          isLarge
            ? "col-span-2 h-12 min-h-12 w-full rounded-xl px-4 text-sm font-semibold"
            : "h-8 rounded-full px-3 text-xs font-semibold",
          !allSelected && "bg-card",
        )}
        onClick={() => (allSelected ? onClearAll() : onSelectAll())}
      >
        {isLarge ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCheck className="size-4" strokeWidth={2} />
            {selectAllLabel}
          </span>
        ) : (
          selectAllLabel
        )}
      </Button>
    ) : null;

  return (
    <div className={cn("space-y-3", isLarge && "space-y-4")}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      )}
      <div
        className={cn(
          isLarge ? "grid grid-cols-2 gap-3" : "flex flex-wrap gap-2",
        )}
      >
        {options.map((option) => {
          const active = selected.includes(option);
          const tint = getIconTint?.(option);

          return (
            <Button
              key={option}
              type="button"
              size={isLarge ? "lg" : "sm"}
              variant={active ? "default" : "outline"}
              className={cn(
                isLarge
                  ? "h-auto min-h-[4.5rem] w-full flex-col gap-2 rounded-xl px-3 py-3 text-sm font-medium"
                  : "h-8 rounded-full px-3 text-xs",
                !active && "border-hairline bg-card hover:bg-surface-soft",
                isLarge && getIcon && "justify-center",
              )}
              onClick={() => onToggle(option)}
            >
              {isLarge && getIcon ? (
                <>
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-colors",
                      active
                        ? "bg-primary-foreground/15 text-primary-foreground"
                        : tint ?? "bg-surface-soft text-body-text",
                    )}
                  >
                    {getIcon(option, active)}
                  </span>
                  <span className="leading-tight">{getLabel(option)}</span>
                </>
              ) : (
                getLabel(option)
              )}
            </Button>
          );
        })}
        {selectAllButton}
      </div>
    </div>
  );
}

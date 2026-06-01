"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DEFAULT_FILTERS, type FilterState } from "@/lib/types";

type FilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onSubmit: () => void;
  submitLabel?: string;
};

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onChange,
  onSubmit,
  submitLabel,
}: FilterSheetProps) {
  const t = useTranslations("filters");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton
        className="flex max-h-[92vh] flex-col gap-0 rounded-t-xl px-0 pb-0"
      >
        <SheetHeader className="shrink-0 border-b px-5 pb-4">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="text-left">
              <SheetTitle className="font-display text-xl">{t("title")}</SheetTitle>
              <SheetDescription>{t("sheet_description")}</SheetDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 text-muted-foreground"
              onClick={() => onChange({ ...DEFAULT_FILTERS })}
            >
              <RotateCcw className="size-3.5" />
              {t("reset")}
            </Button>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-4">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onSubmit={onSubmit}
            embedded
            showFooter={false}
          />
        </div>

        <div className="shrink-0 border-t bg-background px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <Button type="button" size="lg" className="h-11 w-full rounded-xl" onClick={onSubmit}>
            {submitLabel ?? t("find_btn")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

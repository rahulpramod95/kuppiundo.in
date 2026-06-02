"use client";

import { useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
};

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  const t = useTranslations("app");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-3">
      <div
        className="relative flex-1"
        // Ensure tapping anywhere in the row focuses the input on iOS
        onTouchEnd={() => inputRef.current?.focus()}
      >
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("search_placeholder")}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="h-12 rounded-full border border-hairline bg-canvas pl-11 text-sm text-ink shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0] placeholder:text-text-muted focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/20"
        />
      </div>
      <Button
        type="button"
        size="icon"
        className="size-12 shrink-0 rounded-full"
        onClick={onFilterClick}
        aria-label={t("cta_filter")}
      >
        <SlidersHorizontal className="size-5" />
      </Button>
    </div>
  );
}

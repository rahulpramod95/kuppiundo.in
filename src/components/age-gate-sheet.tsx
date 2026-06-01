"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isOfLegalAgeFromBirthYear,
  maxBirthYear,
  parseBirthYear,
  setAgeVerified,
} from "@/lib/age-gate";
import { cn } from "@/lib/utils";

type AgeGateSheetProps = {
  open: boolean;
  onVerified: () => void;
};

export function AgeGateSheet({ open, onVerified }: AgeGateSheetProps) {
  const t = useTranslations("age_gate");
  const latestBirthYear = useMemo(() => maxBirthYear(), []);
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState<"missing" | "invalid" | "underage" | null>(
    null,
  );

  function handleContinue() {
    if (!birthYear.trim()) {
      setError("missing");
      return;
    }

    const parsed = parseBirthYear(birthYear);
    if (!parsed) {
      setError("invalid");
      return;
    }

    if (!isOfLegalAgeFromBirthYear(parsed)) {
      setError("underage");
      return;
    }

    setAgeVerified();
    onVerified();
  }

  return (
    <Sheet
      open={open}
      modal
      disablePointerDismissal
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen) details.cancel();
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        overlayClassName="bg-black/55 backdrop-blur-[2px]"
        className="rounded-t-2xl border-t border-hairline px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6"
      >
        <SheetHeader className="items-center px-0 text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" aria-hidden />
          </div>
          <SheetTitle className="font-display text-xl font-bold tracking-tight">
            {t("title")}
          </SheetTitle>
          <SheetDescription className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("description")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2 px-0">
          <label htmlFor="age-gate-birth-year" className="text-sm font-medium text-foreground">
            {t("birth_year_label")}
          </label>
          <Input
            id="age-gate-birth-year"
            type="text"
            inputMode="numeric"
            autoComplete="bday-year"
            placeholder={t("birth_year_placeholder")}
            value={birthYear}
            maxLength={4}
            aria-invalid={error !== null}
            onChange={(event) => {
              setBirthYear(event.target.value.replace(/\D/g, "").slice(0, 4));
              setError(null);
            }}
            className={cn(
              "h-12 text-center text-lg font-medium tabular-nums tracking-widest",
              error && "border-destructive ring-destructive/20",
            )}
          />
          <p className="text-xs text-muted-foreground">
            {t("birth_year_hint", { year: latestBirthYear })}
          </p>
          {error === "missing" ? (
            <p className="text-sm text-destructive" role="alert">
              {t("error_missing")}
            </p>
          ) : null}
          {error === "invalid" ? (
            <p className="text-sm text-destructive" role="alert">
              {t("error_invalid")}
            </p>
          ) : null}
          {error === "underage" ? (
            <p className="text-sm text-destructive" role="alert">
              {t("error_underage")}
            </p>
          ) : null}
          <p className="text-xs leading-relaxed text-muted-foreground">{t("legal_note")}</p>
        </div>

        <SheetFooter className="px-0 pt-2">
          <Button
            type="button"
            size="lg"
            className="h-11 w-full rounded-xl text-base font-semibold"
            onClick={handleContinue}
          >
            {t("confirm_cta")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

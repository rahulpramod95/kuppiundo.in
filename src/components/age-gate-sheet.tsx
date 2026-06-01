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
  isOfLegalAge,
  maxDobForLegalAge,
  parseDob,
  setAgeVerified,
} from "@/lib/age-gate";
import { cn } from "@/lib/utils";

type AgeGateSheetProps = {
  open: boolean;
  onVerified: () => void;
};

export function AgeGateSheet({ open, onVerified }: AgeGateSheetProps) {
  const t = useTranslations("age_gate");
  const maxDob = useMemo(() => maxDobForLegalAge(), []);
  const [dob, setDob] = useState("");
  const [error, setError] = useState<"missing" | "underage" | null>(null);

  function handleContinue() {
    const parsed = parseDob(dob);
    if (!parsed) {
      setError("missing");
      return;
    }
    if (!isOfLegalAge(parsed)) {
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
          <label htmlFor="age-gate-dob" className="text-sm font-medium text-foreground">
            {t("dob_label")}
          </label>
          <Input
            id="age-gate-dob"
            type="date"
            value={dob}
            max={maxDob}
            onChange={(event) => {
              setDob(event.target.value);
              setError(null);
            }}
            aria-invalid={error !== null}
            className={cn(
              "h-11 text-base",
              error && "border-destructive ring-destructive/20",
            )}
          />
          {error === "missing" ? (
            <p className="text-sm text-destructive" role="alert">
              {t("error_missing")}
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

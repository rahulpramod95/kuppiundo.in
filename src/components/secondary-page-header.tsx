"use client";

import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type SecondaryPageHeaderProps = {
  backHref?: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

function BackButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10 shrink-0 rounded-full bg-secondary"
      aria-label={label}
      onClick={onClick}
      type="button"
    >
      <ChevronLeft className="size-5" />
    </Button>
  );
}

export function SecondaryPageHeader({
  backHref = "/",
  backLabel,
  title,
  subtitle,
  onBack,
}: SecondaryPageHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border px-5 py-3">
      {onBack ? (
        <BackButton label={backLabel} onClick={onBack} />
      ) : (
        <Link href={backHref}>
          <BackButton label={backLabel} />
        </Link>
      )}
      <div className="min-w-0">
        <h1 className="font-display truncate text-lg font-bold">{title}</h1>
        {subtitle ? <p className="text-xs text-body-text">{subtitle}</p> : null}
      </div>
    </header>
  );
}

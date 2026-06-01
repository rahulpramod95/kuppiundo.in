"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Bell, Languages } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("app");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-10 rounded-full bg-surface-strong"
      onClick={() => router.replace(pathname, { locale: locale === "en" ? "ml" : "en" })}
      aria-label={t("lang_toggle")}
    >
      <Languages className="size-4" />
    </Button>
  );
}

export function SiteHeader() {
  const t = useTranslations("app");

  return (
    <header className="px-5 pt-4 pb-3">
      <div className="flex items-center justify-between rounded-full border border-hairline bg-canvas px-4 py-3 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0]">
        <div className="flex items-center gap-3">
          <Image src="/kuppiundo-logo.svg" alt="" width={32} height={32} className="rounded-lg" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            {t("name")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-full bg-surface-strong"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

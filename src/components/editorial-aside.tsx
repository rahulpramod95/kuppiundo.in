"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function EditorialAside() {
  const t = useTranslations("app");

  return (
    <Reveal>
      <Card className="overflow-hidden border border-hairline bg-surface-soft text-ink">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-semibold leading-tight">
            {t("name")}
            <span className="text-primary">?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-body-text">
          <p>{t("hero_sub")}</p>
          <p className="border-t border-hairline pt-4 text-xs text-text-muted">
            {t("price_updated")} · {t("available_kerala")}
          </p>
        </CardContent>
      </Card>
    </Reveal>
  );
}

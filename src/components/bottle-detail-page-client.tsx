"use client";

import { useTranslations } from "next-intl";
import { BottleDetailClient } from "@/components/bottle-detail-client";
import { SecondaryPageHeader } from "@/components/secondary-page-header";
import type { Bottle } from "@/lib/types";

type BottleDetailPageClientProps = {
  bottle: Bottle;
};

export function BottleDetailPageClient({ bottle }: BottleDetailPageClientProps) {
  const t = useTranslations("detail");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SecondaryPageHeader
        backHref="/results"
        backLabel={t("back")}
        title={t("page_title")}
      />
      <BottleDetailClient bottle={bottle} />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { buildProfileHighlights, countEngagedSteps } from "@/lib/taste-profile";
import type { FilterState } from "@/lib/types";
import { formatPrice } from "@/lib/types";

type TasteProfileSummaryProps = {
  filters: FilterState;
};

export function TasteProfileSummary({ filters }: TasteProfileSummaryProps) {
  const t = useTranslations("journey");
  const tf = useTranslations("filters");
  const tc = useTranslations("categories");

  const engagedSteps = countEngagedSteps(filters);
  const highlights = buildProfileHighlights(filters, {
    any: t("profile_any"),
    budget: (amount) => tf("budget_label", { amount }),
    type: (value) => tc(value as never),
    taste: (value) => tf(`taste_${value}` as never),
    notes: (value) => tf(`notes_${value}` as never),
    occasion: (value) => tf(`occ_${value}` as never),
    abv: (value) => tf(`abv_${value}` as never),
    origin: (value) => tf(`origin_${value}` as never),
    spirits: t("profile_spirits"),
    tasteLabel: t("profile_taste"),
    notesLabel: t("profile_notes"),
    occasionLabel: t("profile_occasion"),
    strengthLabel: t("profile_strength"),
    originLabel: t("profile_origin"),
    budgetLabel: t("profile_budget"),
  });

  const subtitle =
    engagedSteps >= 4
      ? t("summary_sub_rich")
      : engagedSteps >= 2
        ? t("summary_sub_moderate")
        : t("summary_sub_light");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="rounded-md border border-hairline bg-hairline-soft p-5 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">{t("summary_title")}</h1>
        <p className="mt-2 text-sm text-body-text">{subtitle}</p>
      </div>

      <div className="space-y-3 rounded-md border border-hairline bg-canvas p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t("summary_card_title")}
        </p>
        <dl className="space-y-3">
          {highlights.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
              <dt className="shrink-0 text-text-muted">{item.label}</dt>
              <dd className="text-right font-medium text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
        {filters.budget < 10000 && (
          <p className="border-t border-hairline pt-3 text-xs text-text-muted">
            {t("summary_budget_note", {
              amount: formatPrice(filters.budget).replace("₹", ""),
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}

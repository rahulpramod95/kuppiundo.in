"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IndianRupee, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FilterChipGroup } from "@/components/filter-chip-group";
import { SecondaryPageHeader } from "@/components/secondary-page-header";
import { TasteProfileSummary } from "@/components/taste-profile-summary";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { filtersToSearchParams } from "@/lib/filters";
import {
  BUDGET_PRESETS,
  FIND_STEP_COUNT,
  JOURNEY_INITIAL_FILTERS,
  applySkip,
  getStepByIndex,
  isLastStep,
  normalizeJourneyFilters,
  type FindStepId,
} from "@/lib/find-journey";
import {
  countEngagedSteps,
  saveTasteProfile,
  setResultsSessionMeta,
} from "@/lib/taste-profile";
import type { FilterState, SpiritType } from "@/lib/types";
import {
  ABV_OPTIONS,
  NOTE_OPTIONS,
  SPIRIT_TYPES,
  TASTE_OPTIONS,
  formatPrice,
} from "@/lib/types";
import {
  ABV_ICONS,
  ABV_ICON_TINT,
  NOTE_ICONS,
  NOTE_ICON_TINT,
  SPIRIT_ICONS,
  SPIRIT_ICON_TINT,
  TASTE_ICONS,
  TASTE_ICON_TINT,
  renderJourneyIcon,
} from "@/lib/journey-icons";
import { cn } from "@/lib/utils";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

export function FindJourneyClient() {
  const router = useRouter();
  const t = useTranslations("journey");
  const tf = useTranslations("filters");
  const tc = useTranslations("categories");

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ ...JOURNEY_INITIAL_FILTERS });

  const step = getStepByIndex(stepIndex);
  const progress = showSummary
    ? 100
    : ((stepIndex + 1) / FIND_STEP_COUNT) * 100;
  const stepKey = step;
  const stepTitle = t(`${stepKey}_prompt`);
  const milestoneMessage =
    !showSummary && stepIndex === 2
      ? t("milestone_step3")
      : !showSummary && stepIndex === 3
        ? t("milestone_step5")
        : null;

  function goBack() {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    if (stepIndex === 0) {
      router.push("/");
      return;
    }
    setDirection(-1);
    setStepIndex((i) => i - 1);
  }

  function goNext() {
    if (isLastStep(stepIndex)) {
      setShowSummary(true);
      return;
    }
    setDirection(1);
    setStepIndex((i) => i + 1);
  }

  function confirmResults() {
    const normalized = normalizeJourneyFilters(filters);
    const engagedSteps = countEngagedSteps(filters);
    saveTasteProfile(filters);
    setResultsSessionMeta({ engagedSteps, fromJourney: true });
    const query = filtersToSearchParams(normalized);
    router.push(query ? `/results?${query}` : "/results");
  }

  function resetJourney() {
    setFilters({ ...JOURNEY_INITIAL_FILTERS });
    setStepIndex(0);
    setShowSummary(false);
    setDirection(-1);
  }

  function handleSkip() {
    if (showSummary) return;
    setFilters((current) => applySkip(step, current));
    goNext();
  }

  function toggleType(type: SpiritType) {
    setFilters((current) => ({
      ...current,
      type: current.type.includes(type)
        ? current.type.filter((item) => item !== type)
        : [...current.type, type],
    }));
  }

  function toggleList<T extends string>(key: keyof FilterState, value: T) {
    setFilters((current) => {
      const currentList = current[key] as T[];
      const next = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...current, [key]: next };
    });
  }

  function toggleAbv(value: (typeof ABV_OPTIONS)[number]) {
    setFilters((current) => ({
      ...current,
      abv: current.abv.includes(value)
        ? current.abv.filter((item) => item !== value)
        : [...current.abv, value],
    }));
  }

  const selectAllProps = {
    size: "large" as const,
    selectAllLabel: t("select_all"),
  };

  function renderStepContent(currentStep: FindStepId) {
    switch (currentStep) {
      case "type":
        return (
          <FilterChipGroup
            {...selectAllProps}
            options={SPIRIT_TYPES}
            selected={filters.type}
            onToggle={toggleType}
            getLabel={(value) => tc(value)}
            getIcon={(value, active) => renderJourneyIcon(SPIRIT_ICONS[value], active)}
            getIconTint={(value) => SPIRIT_ICON_TINT[value]}
            onSelectAll={() =>
              setFilters((current) => ({ ...current, type: [...SPIRIT_TYPES] }))
            }
            onClearAll={() => setFilters((current) => ({ ...current, type: [] }))}
          />
        );
      case "taste":
        return (
          <FilterChipGroup
            {...selectAllProps}
            options={TASTE_OPTIONS}
            selected={filters.taste}
            onToggle={(value) => toggleList("taste", value)}
            getLabel={(value) => tf(`taste_${value}`)}
            getIcon={(value, active) =>
              renderJourneyIcon(TASTE_ICONS[value as keyof typeof TASTE_ICONS], active)
            }
            getIconTint={(value) => TASTE_ICON_TINT[value as keyof typeof TASTE_ICON_TINT]}
            onSelectAll={() =>
              setFilters((current) => ({ ...current, taste: [...TASTE_OPTIONS] }))
            }
            onClearAll={() => setFilters((current) => ({ ...current, taste: [] }))}
          />
        );
      case "notes":
        return (
          <FilterChipGroup
            {...selectAllProps}
            options={NOTE_OPTIONS}
            selected={filters.notes}
            onToggle={(value) => toggleList("notes", value)}
            getLabel={(value) => tf(`notes_${value}`)}
            getIcon={(value, active) =>
              renderJourneyIcon(NOTE_ICONS[value as keyof typeof NOTE_ICONS], active)
            }
            getIconTint={(value) => NOTE_ICON_TINT[value as keyof typeof NOTE_ICON_TINT]}
            onSelectAll={() =>
              setFilters((current) => ({ ...current, notes: [...NOTE_OPTIONS] }))
            }
            onClearAll={() => setFilters((current) => ({ ...current, notes: [] }))}
          />
        );
      case "abv":
        return (
          <FilterChipGroup
            {...selectAllProps}
            options={ABV_OPTIONS}
            selected={filters.abv}
            onToggle={toggleAbv}
            getLabel={(value) => tf(`abv_${value}`)}
            getIcon={(value, active) => renderJourneyIcon(ABV_ICONS[value], active)}
            getIconTint={(value) => ABV_ICON_TINT[value]}
            onSelectAll={() =>
              setFilters((current) => ({ ...current, abv: [...ABV_OPTIONS] }))
            }
            onClearAll={() => setFilters((current) => ({ ...current, abv: [] }))}
          />
        );
      case "budget":
        return (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_PRESETS.map((preset) => {
                const active = filters.budget === preset.value;
                return (
                  <Button
                    key={preset.key}
                    type="button"
                    size="lg"
                    variant={active ? "default" : "outline"}
                    className={cn(
                      "h-11 rounded-xl text-sm font-medium",
                      !active && "border-hairline bg-card hover:bg-surface-soft",
                    )}
                    onClick={() =>
                      setFilters((current) => ({ ...current, budget: preset.value }))
                    }
                  >
                    {t(preset.key)}
                  </Button>
                );
              })}
            </div>

            <div className="space-y-4 border-t border-hairline pt-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-body-text">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#fef6e4] text-[#b8860b]">
                    <IndianRupee className="size-3.5" strokeWidth={2} />
                  </span>
                  {t("budget_fine_tune")}
                </span>
                <span className="font-display text-lg font-semibold text-ink">
                  {tf("budget_label", {
                    amount: formatPrice(filters.budget).replace("₹", ""),
                  })}
                </span>
              </div>
              <Slider
                min={500}
                max={10000}
                step={100}
                value={[filters.budget]}
                onValueChange={(value) => {
                  const next = Array.isArray(value) ? value[0] : value;
                  setFilters((current) => ({
                    ...current,
                    budget: next ?? current.budget,
                  }));
                }}
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>{formatPrice(500)}</span>
                <span>{formatPrice(10000)}</span>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SecondaryPageHeader
        backLabel={t("back")}
        title={t("page_title")}
        onBack={goBack}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-6">
        <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-1 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-text-muted">
              {showSummary
                ? t("summary_step_label")
                : t("step_of", { current: stepIndex + 1, total: FIND_STEP_COUNT })}
            </p>
            {!showSummary ? (
              <button
                type="button"
                onClick={handleSkip}
                className="shrink-0 text-sm font-medium text-ink underline underline-offset-4 transition-colors hover:text-body-text"
              >
                {t("skip")}
              </button>
            ) : null}
          </div>
          {milestoneMessage ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 px-3 py-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Sparkles className="size-4" strokeWidth={2} />
              </span>
              <p className="text-sm font-medium text-ink">{milestoneMessage}</p>
            </motion.div>
          ) : null}
        </div>

        {showSummary ? (
          <TasteProfileSummary filters={filters} />
        ) : (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h1 className="font-display text-2xl font-bold leading-tight text-ink">
                  {stepTitle}
                </h1>
                <p className="text-sm leading-relaxed text-body-text">
                  {t(`${stepKey}_sub`)}
                </p>
              </div>

              <div className="rounded-md border border-hairline bg-canvas p-5 shadow-sm">
                {renderStepContent(step)}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        </div>
      </div>

      <div className="shrink-0 bg-canvas px-5 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-xl text-sm font-medium"
            onClick={showSummary ? resetJourney : goBack}
          >
            {showSummary ? t("summary_reset") : t("back")}
          </Button>
          <Button
            type="button"
            className="h-12 flex-1 rounded-xl text-sm font-medium"
            onClick={showSummary ? confirmResults : goNext}
          >
            {showSummary
              ? t("summary_cta")
              : isLastStep(stepIndex)
                ? t("summary_preview_btn")
                : t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}

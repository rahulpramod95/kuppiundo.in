"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const t = useTranslations("app");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -48]);

  function scrollToFilters() {
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-canvas text-ink"
    >
      <div className="hero-grain pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#428bff]/10 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

      <motion.div style={{ opacity, y }} className="relative mx-auto flex min-h-[min(88vh,760px)] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-5 rounded-full border border-hairline bg-surface-soft text-ink hover:bg-surface-soft">
            <Sparkles className="size-3" />
            {t("available_kerala")}
          </Badge>
        </motion.div>

        <motion.h1
          className="font-display max-w-4xl text-[clamp(2.5rem,8vw,4.75rem)] font-bold leading-[0.95] tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("hero_heading").split(".")[0]}
          <span className="text-primary">.</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-body-text sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
        >
          {t("hero_sub")}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          <Button size="lg" className="h-11 px-6" onClick={scrollToFilters}>
            {t("cta_filter")}
          </Button>
          <p className="text-xs text-text-muted">{t("tagline")}</p>
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollToFilters}
          className="mt-14 inline-flex items-center gap-2 self-start text-xs font-medium text-text-muted transition hover:text-ink"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-4" />
          {t("scroll_hint")}
        </motion.button>
      </motion.div>
    </section>
  );
}

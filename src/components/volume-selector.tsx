"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Bottle } from "@/lib/types";
import { formatPrice as formatInr } from "@/lib/types";

type VolumeSelectorProps = {
  bottle: Bottle;
  className?: string;
};

export function VolumeSelector({ bottle, className }: VolumeSelectorProps) {
  const t = useTranslations("detail");
  const [selectedVolume, setSelectedVolume] = useState(bottle.volumes[0]?.ml ?? 750);
  const [quantity, setQuantity] = useState(1);

  const volume = bottle.volumes.find((item) => item.ml === selectedVolume) ?? bottle.volumes[0];
  const total = (volume?.price ?? bottle.price_750ml) * quantity;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("select_volume")}
        </p>
        <div className="flex flex-wrap gap-2">
          {bottle.volumes.map((item) => (
            <Button
              key={item.ml}
              type="button"
              size="sm"
              variant={selectedVolume === item.ml ? "default" : "outline"}
              className="h-9 rounded-lg"
              onClick={() => setSelectedVolume(item.ml)}
            >
              {item.ml} ml · {formatInr(item.price)}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("items_label")}
        </p>
        <div className="inline-flex items-center gap-1 rounded-lg border bg-card p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-10 text-center text-sm font-bold">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t("price_label")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="font-display text-4xl font-semibold text-ink">{formatInr(total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("price_note")}</p>
        </CardContent>
        <CardFooter>
          <Button type="button" size="lg" className="h-11 w-full">
            {t("proceed_btn")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

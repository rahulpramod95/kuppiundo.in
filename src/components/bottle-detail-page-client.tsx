"use client";

import { BottleDetailClient } from "@/components/bottle-detail-client";
import type { Bottle } from "@/lib/types";

type BottleDetailPageClientProps = {
  bottle: Bottle;
  imageSrc?: string | null;
};

export function BottleDetailPageClient({ bottle, imageSrc }: BottleDetailPageClientProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BottleDetailClient bottle={bottle} imageSrc={imageSrc} />
    </div>
  );
}

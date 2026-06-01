"use client";

import { BottleDetailClient } from "@/components/bottle-detail-client";
import type { Bottle } from "@/lib/types";

type BottleDetailPageClientProps = {
  bottle: Bottle;
};

export function BottleDetailPageClient({ bottle }: BottleDetailPageClientProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BottleDetailClient bottle={bottle} />
    </div>
  );
}

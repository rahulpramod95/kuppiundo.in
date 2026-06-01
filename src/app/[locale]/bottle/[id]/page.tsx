import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBottleById } from "@/lib/bottles";
import { getBottleImageSrc } from "@/lib/bottle-images";
import { BottleDetailPageClient } from "@/components/bottle-detail-page-client";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const bottle = await getBottleById(id);
  return {
    title: bottle ? `${bottle.name} · Kuppiundo` : "Bottle · Kuppiundo",
  };
}

export default async function BottleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const bottle = await getBottleById(id);

  if (!bottle) notFound();

  const imageSrc = getBottleImageSrc(bottle.id);

  return <BottleDetailPageClient bottle={bottle} imageSrc={imageSrc} />;
}

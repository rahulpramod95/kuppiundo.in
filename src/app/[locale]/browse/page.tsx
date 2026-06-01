import { getBottles } from "@/lib/bottles";
import { getBottleImageSrcMap } from "@/lib/bottle-images";
import { BrowsePageClient } from "@/components/browse-page-client";

export default async function BrowsePage() {
  const bottles = await getBottles();
  const imageMap = getBottleImageSrcMap(bottles.map((bottle) => bottle.id));
  return <BrowsePageClient bottles={bottles} imageMap={imageMap} />;
}

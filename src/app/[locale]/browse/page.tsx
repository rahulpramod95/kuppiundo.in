import { getBottles } from "@/lib/bottles";
import { BrowsePageClient } from "@/components/browse-page-client";

export default async function BrowsePage() {
  const bottles = await getBottles();
  return <BrowsePageClient bottles={bottles} />;
}

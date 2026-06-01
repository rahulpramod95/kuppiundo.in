import type { LucideIcon } from "lucide-react";
import {
  Apple,
  BatteryLow,
  Beer,
  CalendarDays,
  Candy,
  Citrus,
  Coffee,
  Cookie,
  Droplets,
  Flame,
  Flower2,
  Gauge,
  Gift,
  Globe,
  Grape,
  Beaker,
  MapPin,
  Martini,
  PartyPopper,
  Snowflake,
  Sparkles,
  TreeDeciduous,
  Waves,
  Wine,
  Wind,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import type { AbvRange, Origin, SpiritType } from "./types";
import { NOTE_OPTIONS, OCCASION_OPTIONS, TASTE_OPTIONS } from "./types";

type TasteOption = (typeof TASTE_OPTIONS)[number];
type NoteOption = (typeof NOTE_OPTIONS)[number];
type OccasionOption = (typeof OCCASION_OPTIONS)[number];

export const SPIRIT_ICONS: Record<SpiritType, LucideIcon> = {
  whisky: Wine,
  rum: Martini,
  brandy: Wine,
  gin: Sparkles,
  vodka: Snowflake,
  beer: Beer,
  wine: Grape,
};

export const TASTE_ICONS: Record<TasteOption, LucideIcon> = {
  smooth: Waves,
  peaty: Wind,
  fruity: Apple,
  spicy: Flame,
  sweet: Candy,
  dry: Droplets,
};

export const NOTE_ICONS: Record<NoteOption, LucideIcon> = {
  vanilla: Sparkles,
  oak: TreeDeciduous,
  caramel: Candy,
  citrus: Citrus,
  floral: Flower2,
  chocolate: Cookie,
  honey: Beaker,
  spice: Zap,
};

export const OCCASION_ICONS: Record<OccasionOption, LucideIcon> = {
  casual: Coffee,
  gifting: Gift,
  party: PartyPopper,
  cocktails: Martini,
  daily: CalendarDays,
};

export const ABV_ICONS: Record<AbvRange, LucideIcon> = {
  low: BatteryLow,
  medium: Gauge,
  high: Flame,
};

export const ORIGIN_ICONS: Record<Origin, LucideIcon> = {
  imfl: MapPin,
  fmfl: Globe,
};

export const SPIRIT_ICON_TINT: Record<SpiritType, string> = {
  whisky: "bg-[#f5ebe0] text-[#8b5a2b]",
  rum: "bg-[#f0ebe0] text-[#9a7342]",
  brandy: "bg-[#f5e8e8] text-[#8b4040]",
  gin: "bg-[#e8f0f5] text-[#3d6b8a]",
  vodka: "bg-[#e8eef5] text-[#4a6080]",
  beer: "bg-[#eef2e8] text-[#5a7040]",
  wine: "bg-[#f0e8f0] text-[#704070]",
};

export const NOTE_ICON_TINT: Record<NoteOption, string> = {
  vanilla: "bg-[#faf0e4] text-[#a67c52]",
  oak: "bg-[#ede4d8] text-[#6b5344]",
  caramel: "bg-[#faf0dc] text-[#b8860b]",
  citrus: "bg-[#fef6e4] text-[#c47d0e]",
  floral: "bg-[#f5e8f0] text-[#a8557a]",
  chocolate: "bg-[#f0e6dc] text-[#6b4423]",
  honey: "bg-[#fef3c7] text-[#b45309]",
  spice: "bg-[#fce8e8] text-[#c0392b]",
};

export const TASTE_ICON_TINT: Record<TasteOption, string> = {
  smooth: "bg-[#e8f4f8] text-[#3d7a8a]",
  peaty: "bg-[#ece8e4] text-[#5c5048]",
  fruity: "bg-[#fef0e8] text-[#c45c2a]",
  spicy: "bg-[#fce8e8] text-[#c0392b]",
  sweet: "bg-[#f5e8f0] text-[#a8557a]",
  dry: "bg-[#eef2f5] text-[#506070]",
};

export const OCCASION_ICON_TINT: Record<OccasionOption, string> = {
  casual: "bg-[#f0ebe4] text-[#7a6048]",
  gifting: "bg-[#f5e8f0] text-[#904070]",
  party: "bg-[#fef0e8] text-[#c45c2a]",
  cocktails: "bg-[#e8f0f8] text-[#3d6b8a]",
  daily: "bg-[#eef2e8] text-[#507040]",
};

export const ABV_ICON_TINT: Record<AbvRange, string> = {
  low: "bg-[#e8f5ec] text-[#2d8a4e]",
  medium: "bg-[#fef6e4] text-[#b8860b]",
  high: "bg-[#fce8e8] text-[#c0392b]",
};

export const ORIGIN_ICON_TINT: Record<Origin, string> = {
  imfl: "bg-[#fef6e4] text-[#c47d0e]",
  fmfl: "bg-[#e8eef8] text-[#3d5a8a]",
};

export function renderJourneyIcon(Icon: LucideIcon, active: boolean): ReactNode {
  const IconComponent = Icon;
  return <IconComponent className="size-5" strokeWidth={active ? 2.25 : 1.75} />;
}

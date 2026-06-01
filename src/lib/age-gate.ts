export const MIN_DRINKING_AGE = 21;
export const AGE_GATE_STORAGE_KEY = "kuppiundo-age-verified";

export function isAgeVerified(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AGE_GATE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAgeVerified(): void {
  try {
    localStorage.setItem(AGE_GATE_STORAGE_KEY, "true");
  } catch {
    // Ignore storage failures; user can verify again next visit.
  }
}

export function parseBirthYear(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d{4}$/.test(trimmed)) return null;

  const year = Number(trimmed);
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return null;

  return year;
}

export function isOfLegalAgeFromBirthYear(
  birthYear: number,
  today = new Date(),
): boolean {
  return today.getFullYear() - birthYear >= MIN_DRINKING_AGE;
}

export function maxBirthYear(today = new Date()): number {
  return today.getFullYear() - MIN_DRINKING_AGE;
}

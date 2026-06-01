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

export function parseDob(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function isOfLegalAge(dob: Date, today = new Date()): boolean {
  const cutoff = new Date(
    today.getFullYear() - MIN_DRINKING_AGE,
    today.getMonth(),
    today.getDate(),
  );
  return dob <= cutoff;
}

export function maxDobForLegalAge(today = new Date()): string {
  const d = new Date(
    today.getFullYear() - MIN_DRINKING_AGE,
    today.getMonth(),
    today.getDate(),
  );
  return formatDateInputValue(d);
}

export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

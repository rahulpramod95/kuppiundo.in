export function buildWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppShare(message: string): void {
  window.open(buildWhatsAppShareUrl(message), "_blank", "noopener,noreferrer");
}

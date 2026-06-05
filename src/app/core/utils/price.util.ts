export function centsToEuro(cents: number): number {
  return cents / 100;
}

export function euroToCents(euro: number): number {
  return Math.round(euro * 100);
}

export function parseEuroInput(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (!normalized) {
    return null;
  }
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

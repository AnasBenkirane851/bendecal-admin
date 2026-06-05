import { Fitment } from '../models/fitment.model';

export function formatFitment(fitment: Fitment): string {
  const years =
    fitment.yearFrom === fitment.yearTo
      ? String(fitment.yearFrom)
      : `${fitment.yearFrom}–${fitment.yearTo}`;
  return `${fitment.make} ${fitment.model} ${years}`;
}

export function formatFitments(fitments: Fitment[]): string {
  if (!fitments.length) {
    return '—';
  }
  return fitments.map(formatFitment).join(' · ');
}

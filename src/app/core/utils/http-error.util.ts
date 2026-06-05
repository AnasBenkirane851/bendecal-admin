import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/auth.model';

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as ErrorResponse | string | null;
    if (body && typeof body === 'object' && 'message' in body && body.message) {
      return body.message;
    }
    if (typeof body === 'string' && body) {
      return body;
    }
    if (err.status === 0) {
      return 'Impossible de joindre l’API. Vérifiez que le serveur est démarré.';
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}

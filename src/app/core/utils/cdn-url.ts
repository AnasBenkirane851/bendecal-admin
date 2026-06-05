import { environment } from '../../../environments/environment';

export function cdnUrl(key: string): string {
  if (!key) {
    return '';
  }
  if (/^https?:\/\//i.test(key)) {
    return key;
  }
  const base = environment.cdnBaseUrl.replace(/\/$/, '');
  return `${base}/${key.replace(/^\//, '')}`;
}

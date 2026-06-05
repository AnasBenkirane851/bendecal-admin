import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});

export const SHOP_URL = new InjectionToken<string>('SHOP_URL', {
  providedIn: 'root',
  factory: () => environment.shopUrl,
});

export const CDN_BASE_URL = new InjectionToken<string>('CDN_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.cdnBaseUrl,
});

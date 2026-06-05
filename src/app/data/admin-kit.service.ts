import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kit, KitWritePayload, PatchKitPayload } from '../core/models/kit.model';
import { API_BASE_URL } from '../core/tokens/api-url.token';

export interface KitListParams {
  search?: string;
  page?: number;
  size?: number;
  featured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminKitService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(params: KitListParams = {}): Observable<Kit[]> {
    let httpParams = new HttpParams();
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.page != null) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params.size != null) {
      httpParams = httpParams.set('size', params.size);
    }
    if (params.featured != null) {
      httpParams = httpParams.set('featured', params.featured);
    }
    return this.http.get<Kit[]>(`${this.apiBaseUrl}/admin/kits`, { params: httpParams });
  }

  getById(id: string): Observable<Kit> {
    return this.http.get<Kit>(`${this.apiBaseUrl}/admin/kits/${id}`);
  }

  create(payload: KitWritePayload): Observable<Kit> {
    return this.http.post<Kit>(`${this.apiBaseUrl}/admin/kits`, payload);
  }

  update(id: string, payload: KitWritePayload): Observable<Kit> {
    return this.http.put<Kit>(`${this.apiBaseUrl}/admin/kits/${id}`, payload);
  }

  patchFeatured(id: string, featured: boolean): Observable<Kit> {
    const body: PatchKitPayload = { featured };
    return this.http.patch<Kit>(`${this.apiBaseUrl}/admin/kits/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/admin/kits/${id}`);
  }
}

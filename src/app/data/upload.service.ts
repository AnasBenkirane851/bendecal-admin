import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { PresignResponse } from '../core/models/upload.model';
import { API_BASE_URL } from '../core/tokens/api-url.token';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  presign(slug: string, file: File): Observable<string> {
    return this.http
      .post<PresignResponse>(`${this.apiBaseUrl}/admin/uploads/presign`, {
        slug,
        filename: file.name,
      })
      .pipe(
        switchMap((res) =>
          from(
            fetch(res.uploadUrl, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file.type || 'application/octet-stream' },
            }),
          ).pipe(
            map((response) => {
              if (!response.ok) {
                throw new Error(`Upload failed (${response.status})`);
              }
              return res.key;
            }),
          ),
        ),
      );
  }
}

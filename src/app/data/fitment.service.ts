import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { API_BASE_URL } from '../core/tokens/api-url.token';

@Injectable({ providedIn: 'root' })
export class FitmentService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getMakes(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiBaseUrl}/fitment/makes`)
      .pipe(catchError(() => of([])));
  }

  getModels(make: string): Observable<string[]> {
    const params = new HttpParams().set('make', make);
    return this.http
      .get<string[]>(`${this.apiBaseUrl}/fitment/models`, { params })
      .pipe(catchError(() => of([])));
  }

  getYears(make: string, model: string): Observable<number[]> {
    const params = new HttpParams().set('make', make).set('model', model);
    return this.http
      .get<number[]>(`${this.apiBaseUrl}/fitment/years`, { params })
      .pipe(catchError(() => of([])));
  }
}

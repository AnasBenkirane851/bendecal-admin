import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AdminUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { API_BASE_URL } from '../tokens/api-url.token';

const TOKEN_KEY = 'bendecal_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly router = inject(Router);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/admin/auth/login`, request)
      .pipe(tap((res) => this.setToken(res.accessToken)));
  }

  me(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiBaseUrl}/admin/auth/me`);
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { apiErrorMessage } from '../../core/utils/http-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div
      class="flex min-h-screen min-h-[100dvh] items-center justify-center bg-surface-subtle px-4 py-8 pb-[env(safe-area-inset-bottom)]"
    >
      <div class="card w-full max-w-md">
        <h1 class="font-display text-2xl font-bold uppercase tracking-wide text-brand-600 sm:text-3xl">Bendecal Admin</h1>
        <p class="mt-1 text-sm text-ink-muted">Connexion interne</p>

        <form class="mt-6 space-y-4 sm:mt-8" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="label-field" for="email">Email</label>
            <input
              id="email"
              type="email"
              class="input-field"
              formControlName="email"
              autocomplete="username"
              inputmode="email"
            />
          </div>
          <div>
            <label class="label-field" for="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              class="input-field"
              formControlName="password"
              autocomplete="current-password"
            />
          </div>
          @if (errorMessage) {
            <p class="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger" role="alert">{{ errorMessage }}</p>
          }
          <button type="submit" class="btn-primary w-full sm:w-full" [disabled]="form.invalid || loading">
            {{ loading ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  errorMessage = '';

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigate(['/dashboard']);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = apiErrorMessage(err, 'Identifiants invalides');
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen min-h-[100dvh] flex-col lg:flex-row">
      @if (navOpen()) {
        <button
          type="button"
          class="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          aria-label="Fermer le menu"
          (click)="closeNav()"
        ></button>
      }

      <aside
        class="fixed inset-y-0 left-0 z-50 flex w-[min(100%,18rem)] -translate-x-full flex-col border-r border-line bg-white transition-transform duration-200 lg:static lg:z-auto lg:w-56 lg:shrink-0 lg:translate-x-0"
        [class.translate-x-0]="navOpen()"
        aria-label="Navigation principale"
      >
        <div class="flex items-center justify-between border-b border-line px-4 py-4 lg:px-5 lg:py-5">
          <div>
            <p class="font-display text-xl font-bold uppercase tracking-wide text-brand-600 lg:text-2xl">Bendecal</p>
            <p class="text-xs text-ink-muted">Administration</p>
          </div>
          <button type="button" class="btn-ghost -mr-2 p-2 lg:hidden" aria-label="Fermer" (click)="closeNav()">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-brand-50 text-brand-700"
            class="nav-link"
            (click)="closeNav()"
            >Dashboard</a
          >
          <a routerLink="/kits" routerLinkActive="bg-brand-50 text-brand-700" class="nav-link" (click)="closeNav()"
            >Kits</a
          >
          <a
            routerLink="/orders"
            routerLinkActive="bg-brand-50 text-brand-700"
            class="nav-link"
            (click)="closeNav()"
            >Commandes</a
          >
        </nav>
        <div class="border-t border-line p-3">
          <button type="button" class="btn-ghost w-full justify-start min-h-11" (click)="logout()">Déconnexion</button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:hidden"
        >
          <button type="button" class="btn-ghost -ml-2 p-2" aria-label="Ouvrir le menu" (click)="openNav()">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p class="min-w-0 flex-1 truncate font-display text-lg font-semibold uppercase tracking-wide text-brand-600">
            Bendecal
          </p>
        </header>

        <main class="min-w-0 flex-1 px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-8">
          <router-outlet />
        </main>

        <nav
          class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
          aria-label="Navigation rapide"
        >
          <div class="grid grid-cols-3">
            <a
              routerLink="/dashboard"
              routerLinkActive="text-brand-600"
              class="bottom-nav-item"
              (click)="closeNav()"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
              </svg>
              <span>Accueil</span>
            </a>
            <a routerLink="/kits" routerLinkActive="text-brand-600" class="bottom-nav-item" (click)="closeNav()">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h10" />
              </svg>
              <span>Kits</span>
            </a>
            <a routerLink="/orders" routerLinkActive="text-brand-600" class="bottom-nav-item" (click)="closeNav()">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Commandes</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly navOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.navOpen.set(false));
  }

  openNav(): void {
    this.navOpen.set(true);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }

  logout(): void {
    this.closeNav();
    this.auth.logout();
  }
}

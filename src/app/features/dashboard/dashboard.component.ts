import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminKitService } from '../../data/admin-kit.service';
import { AdminOrderService } from '../../data/admin-order.service';
import { apiErrorMessage } from '../../core/utils/http-error.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <div>
        <h1 class="section-title">Dashboard</h1>
        <p class="mt-1 text-sm text-ink-muted">Vue d’ensemble du catalogue et des commandes</p>
      </div>
    </header>

    @if (error()) {
      <p class="mb-4 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">{{ error() }}</p>
    }

    @if (loading()) {
      <p class="text-sm text-ink-muted">Chargement…</p>
    } @else {
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <div class="card">
          <p class="text-sm text-ink-muted">Kits au catalogue</p>
          <p class="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{{ totalKits() }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-ink-muted">Kits mis en avant</p>
          <p class="mt-2 font-display text-3xl font-bold text-brand-600 sm:text-4xl">{{ featuredKits() }}</p>
        </div>
        <div class="card sm:col-span-2 lg:col-span-1">
          <p class="text-sm text-ink-muted">Commandes récentes</p>
          <p class="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{{ recentOrders() }}</p>
        </div>
      </div>

      <div class="page-header-actions mt-6">
        <a routerLink="/kits/new" class="btn-primary">Nouveau kit</a>
        <a routerLink="/orders" class="btn-secondary">Voir les commandes</a>
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  private readonly kitService = inject(AdminKitService);
  private readonly orderService = inject(AdminOrderService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly totalKits = signal(0);
  readonly featuredKits = signal(0);
  readonly recentOrders = signal(0);

  ngOnInit(): void {
    forkJoin({
      kits: this.kitService.list({ size: 500 }),
      featured: this.kitService.list({ featured: true, size: 500 }),
      orders: this.orderService.list({ size: 100 }),
    }).subscribe({
      next: ({ kits, featured, orders }) => {
        this.totalKits.set(kits.length);
        this.featuredKits.set(featured.length);
        this.recentOrders.set(orders.length);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err, 'Erreur de chargement'));
        this.loading.set(false);
      },
    });
  }
}

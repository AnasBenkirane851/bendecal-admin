import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderSummary } from '../../../core/models/order.model';
import { apiErrorMessage } from '../../../core/utils/http-error.util';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { AdminOrderService } from '../../../data/admin-order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, DatePipe, PricePipe],
  template: `
    <header class="page-header">
      <div>
        <h1 class="section-title">Commandes</h1>
        <p class="mt-1 text-sm text-ink-muted">Lecture seule — passées via la boutique</p>
      </div>
    </header>

    @if (error()) {
      <p class="mb-4 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">{{ error() }}</p>
    }

    @if (loading()) {
      <p class="text-sm text-ink-muted">Chargement…</p>
    } @else if (!orders().length) {
      <p class="text-sm text-ink-muted">Aucune commande.</p>
    } @else {
      <ul class="flex flex-col gap-3 md:hidden">
        @for (order of orders(); track order.id) {
          <li>
            <a [routerLink]="['/orders', order.id]" class="mobile-list-card block">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium text-brand-600">{{ order.id }}</p>
                  <p class="mt-1 text-sm text-ink-secondary">{{ order.customerEmail }}</p>
                  <p class="mt-1 text-xs text-ink-muted">{{ order.createdAt | date: 'short' : '' : 'fr-FR' }}</p>
                </div>
                <div class="shrink-0 text-right">
                  <p class="font-semibold text-ink">{{ order.totalCents | price }}</p>
                  <p class="text-xs text-ink-muted">{{ order.lineCount }} ligne(s)</p>
                </div>
              </div>
            </a>
          </li>
        }
      </ul>

      <div class="hidden overflow-x-auto rounded-lg border border-line bg-white md:block">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-line bg-surface-subtle text-ink-secondary">
            <tr>
              <th class="px-4 py-3 font-medium">ID</th>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Client</th>
              <th class="px-4 py-3 font-medium">Total</th>
              <th class="px-4 py-3 font-medium">Lignes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            @for (order of orders(); track order.id) {
              <tr class="hover:bg-surface-subtle/80">
                <td class="px-4 py-3">
                  <a [routerLink]="['/orders', order.id]" class="font-medium text-brand-600 hover:underline">{{
                    order.id
                  }}</a>
                </td>
                <td class="px-4 py-3 text-ink-secondary">{{ order.createdAt | date: 'short' : '' : 'fr-FR' }}</td>
                <td class="px-4 py-3 text-ink-secondary">{{ order.customerEmail }}</td>
                <td class="px-4 py-3 text-ink">{{ order.totalCents | price }}</td>
                <td class="px-4 py-3 text-ink-secondary">{{ order.lineCount }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class OrderListComponent implements OnInit {
  private readonly orderService = inject(AdminOrderService);

  readonly orders = signal<OrderSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.orderService.list({ size: 100 }).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err, 'Erreur de chargement'));
        this.loading.set(false);
      },
    });
  }
}

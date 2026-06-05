import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { cdnUrl } from '../../../core/utils/cdn-url';
import { apiErrorMessage } from '../../../core/utils/http-error.util';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { AdminOrderService } from '../../../data/admin-order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, PricePipe],
  template: `
    <header class="page-header">
      <div class="min-w-0">
        <a routerLink="/orders" class="text-sm text-brand-600 hover:underline">← Commandes</a>
        <h1 class="section-title mt-2 break-all">Commande {{ order()?.id }}</h1>
        @if (order()) {
          <p class="mt-1 text-sm text-ink-muted">{{ order()!.createdAt | date: 'medium' : '' : 'fr-FR' }}</p>
        }
      </div>
    </header>

    @if (loading()) {
      <p class="text-sm text-ink-muted">Chargement…</p>
    } @else if (error()) {
      <p class="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">{{ error() }}</p>
    } @else if (order()) {
      @let o = order()!;
      <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <section class="card space-y-3">
          <h2 class="font-semibold text-ink">Client</h2>
          <p class="text-sm break-words"><span class="text-ink-muted">Nom :</span> {{ o.customer.fullName }}</p>
          <p class="text-sm break-all"><span class="text-ink-muted">Email :</span> {{ o.customer.email }}</p>
          <p class="text-sm"><span class="text-ink-muted">Téléphone :</span> {{ o.customer.phone }}</p>
        </section>
        <section class="card space-y-3">
          <h2 class="font-semibold text-ink">Adresse</h2>
          <p class="text-sm">{{ o.address.line1 }}</p>
          <p class="text-sm">{{ o.address.postalCode }} {{ o.address.city }}</p>
          <p class="text-sm">{{ o.address.country }}</p>
        </section>
      </div>

      <section class="card mt-4 sm:mt-6">
        <h2 class="mb-4 font-semibold text-ink">Lignes</h2>
        <ul class="divide-y divide-line">
          @for (line of o.lines; track line.variantId) {
            <li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
              <div class="flex gap-3 sm:min-w-0 sm:flex-1">
                @if (line.image) {
                  <img [src]="lineImage(line.image)" alt="" class="h-16 w-16 shrink-0 rounded object-cover" />
                }
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-ink">{{ line.kitName }} — {{ line.variantLabel }}</p>
                  <p class="text-xs text-ink-muted">SKU {{ line.sku }} · Qté {{ line.quantity }}</p>
                </div>
              </div>
              <p class="shrink-0 text-base font-semibold text-ink sm:text-sm sm:font-medium">{{ line.priceCents * line.quantity | price }}</p>
            </li>
          }
        </ul>
        <dl class="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-ink-muted">Sous-total</dt>
            <dd class="font-medium text-ink">{{ o.subtotalCents | price }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-muted">Livraison</dt>
            <dd class="font-medium text-ink">{{ o.shippingCents | price }}</dd>
          </div>
          <div class="flex justify-between gap-4 text-base">
            <dt class="font-semibold text-ink">Total</dt>
            <dd class="font-semibold text-ink">{{ o.totalCents | price }}</dd>
          </div>
        </dl>
      </section>
    }
  `,
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(AdminOrderService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Commande introuvable');
      this.loading.set(false);
      return;
    }
    this.orderService.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err, 'Commande introuvable'));
        this.loading.set(false);
      },
    });
  }

  lineImage(key: string): string {
    return cdnUrl(key);
  }
}

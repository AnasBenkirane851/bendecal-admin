import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { SHOP_URL } from '../../../core/tokens/api-url.token';
import { cdnUrl } from '../../../core/utils/cdn-url';
import { formatFitments } from '../../../core/utils/fitment.util';
import { apiErrorMessage } from '../../../core/utils/http-error.util';
import { Kit } from '../../../core/models/kit.model';
import { AdminKitService } from '../../../data/admin-kit.service';

@Component({
  selector: 'app-kit-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <header class="page-header">
      <div>
        <h1 class="section-title">Kits</h1>
        <p class="mt-1 text-sm text-ink-muted">Gestion du catalogue</p>
      </div>
      <div class="page-header-actions">
        <a routerLink="/kits/new" class="btn-primary">Créer un kit</a>
      </div>
    </header>

    <div class="mb-4">
      <input
        type="search"
        class="input-field"
        placeholder="Rechercher par nom ou slug…"
        [(ngModel)]="searchTerm"
        (ngModelChange)="onSearchChange()"
      />
    </div>

    @if (error()) {
      <p class="mb-4 rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger">{{ error() }}</p>
    }

    @if (loading()) {
      <p class="text-sm text-ink-muted">Chargement…</p>
    } @else if (!kits().length) {
      <p class="text-sm text-ink-muted">Aucun kit trouvé.</p>
    } @else {
      <ul class="flex flex-col gap-3 md:hidden">
        @for (kit of kits(); track kit.id) {
          <li class="mobile-list-card">
            <div class="flex gap-3">
              @if (kit.images[0]) {
                <img [src]="thumb(kit.images[0])" alt="" class="h-16 w-16 shrink-0 rounded object-cover" />
              } @else {
                <span class="inline-block h-16 w-16 shrink-0 rounded bg-surface-muted"></span>
              }
              <div class="min-w-0 flex-1">
                <p class="font-medium text-ink">{{ kit.name }}</p>
                <p class="text-xs text-ink-muted">{{ kit.slug }}</p>
                @if (kit.featured) {
                  <span class="mt-1 inline-flex rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700"
                    >Featured</span
                  >
                }
                <p class="mt-2 line-clamp-2 text-xs text-ink-secondary">{{ fitmentSummary(kit) }}</p>
                <p class="mt-1 text-xs text-ink-muted">{{ kit.variants.length }} variante(s)</p>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <a [routerLink]="['/kits', kit.id, 'edit']" class="btn-secondary text-center">Modifier</a>
              <a [href]="shopKitUrl(kit.slug)" target="_blank" rel="noopener" class="btn-secondary text-center">Boutique</a>
              <button type="button" class="btn-ghost col-span-2 text-danger" (click)="deleteKit(kit)">Supprimer</button>
            </div>
          </li>
        }
      </ul>

      <div class="hidden overflow-x-auto rounded-lg border border-line bg-white md:block">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-line bg-surface-subtle text-ink-secondary">
            <tr>
              <th class="px-4 py-3 font-medium">Image</th>
              <th class="px-4 py-3 font-medium">Nom</th>
              <th class="px-4 py-3 font-medium">Slug</th>
              <th class="px-4 py-3 font-medium">Fitments</th>
              <th class="px-4 py-3 font-medium">Variantes</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            @for (kit of kits(); track kit.id) {
              <tr class="hover:bg-surface-subtle/80">
                <td class="px-4 py-3">
                  @if (kit.images[0]) {
                    <img [src]="thumb(kit.images[0])" alt="" class="h-12 w-12 rounded object-cover" />
                  } @else {
                    <span class="inline-block h-12 w-12 rounded bg-surface-muted"></span>
                  }
                </td>
                <td class="px-4 py-3 font-medium text-ink">
                  {{ kit.name }}
                  @if (kit.featured) {
                    <span
                      class="ml-2 inline-flex rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700"
                      >Featured</span
                    >
                  }
                </td>
                <td class="px-4 py-3 text-ink-secondary">{{ kit.slug }}</td>
                <td class="max-w-xs truncate px-4 py-3 text-ink-secondary" [title]="fitmentSummary(kit)">
                  {{ fitmentSummary(kit) }}
                </td>
                <td class="px-4 py-3 text-ink-secondary">{{ kit.variants.length }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex flex-wrap justify-end gap-2">
                    <a [routerLink]="['/kits', kit.id, 'edit']" class="btn-ghost text-brand-600">Modifier</a>
                    <button type="button" class="btn-ghost text-danger" (click)="deleteKit(kit)">Supprimer</button>
                    <a [href]="shopKitUrl(kit.slug)" target="_blank" rel="noopener" class="btn-ghost">Boutique</a>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class KitListComponent implements OnInit {
  private readonly kitService = inject(AdminKitService);
  private readonly shopUrl = inject(SHOP_URL);
  private readonly search$ = new Subject<void>();

  readonly kits = signal<Kit[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  searchTerm = '';

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300)).subscribe(() => this.load());
    this.load();
  }

  onSearchChange(): void {
    this.search$.next();
  }

  thumb(key: string): string {
    return cdnUrl(key);
  }

  fitmentSummary(kit: Kit): string {
    return formatFitments(kit.fitments);
  }

  shopKitUrl(slug: string): string {
    const base = this.shopUrl.replace(/\/$/, '');
    return `${base}/kits/${slug}`;
  }

  deleteKit(kit: Kit): void {
    if (!confirm(`Supprimer le kit « ${kit.name} » ?`)) {
      return;
    }
    this.kitService.delete(kit.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(apiErrorMessage(err, 'Suppression impossible')),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    const search = this.searchTerm.trim() || undefined;
    this.kitService.list({ search, size: 200 }).subscribe({
      next: (kits) => {
        this.kits.set(kits);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiErrorMessage(err, 'Erreur de chargement'));
        this.loading.set(false);
      },
    });
  }
}

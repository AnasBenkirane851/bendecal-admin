import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'kits',
        loadComponent: () =>
          import('./features/kits/kit-list/kit-list.component').then((m) => m.KitListComponent),
      },
      {
        path: 'kits/new',
        loadComponent: () =>
          import('./features/kits/kit-form/kit-form.component').then((m) => m.KitFormComponent),
      },
      {
        path: 'kits/:id/edit',
        loadComponent: () =>
          import('./features/kits/kit-form/kit-form.component').then((m) => m.KitFormComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order-list/order-list.component').then((m) => m.OrderListComponent),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./features/orders/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

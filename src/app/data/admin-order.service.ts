import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderSummary } from '../core/models/order.model';
import { API_BASE_URL } from '../core/tokens/api-url.token';

export interface OrderListParams {
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(params: OrderListParams = {}): Observable<OrderSummary[]> {
    let httpParams = new HttpParams();
    if (params.page != null) {
      httpParams = httpParams.set('page', params.page);
    }
    if (params.size != null) {
      httpParams = httpParams.set('size', params.size);
    }
    return this.http.get<OrderSummary[]>(`${this.apiBaseUrl}/admin/orders`, { params: httpParams });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiBaseUrl}/admin/orders/${id}`);
  }
}

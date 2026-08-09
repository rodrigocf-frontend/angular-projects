import { Component, inject, input } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectTotalItems,
} from '../../../product-cart-page/store/product-cart.selectors';

@Component({
  selector: 'app-order-summary',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
  private readonly store = inject(Store);

  items$ = this.store.select(selectCartItems);
  totalItems$ = this.store.select(selectTotalItems);
  totalValue$ = this.store.select(selectCartTotal);
}

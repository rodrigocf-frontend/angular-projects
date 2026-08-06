import { Component, inject } from '@angular/core';
import { QuantyControlComponent } from '../../shared/components/quanty-control/quanty-control.component';
import { Product } from '../../shared/models/product.model';
import { setItemsInCart } from './store/product-cart.actions';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal, selectTotalItems } from './store/product-cart.selectors';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ProductColor, ProductSize } from '../../shared/utils/product';

@Component({
  selector: 'app-product-cart-page',
  imports: [QuantyControlComponent, AsyncPipe, ButtonComponent, CurrencyPipe],
  templateUrl: './product-cart-page.component.html',
  styleUrl: './product-cart-page.component.scss',
})
export default class ProductCartPageComponent {
  private readonly store = inject(Store);

  items$ = this.store.select(selectCartItems);
  totalItems$ = this.store.select(selectTotalItems);
  totalValue$ = this.store.select(selectCartTotal);

  updateQuantity(product: Product, count: number, color: ProductColor, size: ProductSize) {
    this.store.dispatch(setItemsInCart({ product, count, color, size }));
  }
}

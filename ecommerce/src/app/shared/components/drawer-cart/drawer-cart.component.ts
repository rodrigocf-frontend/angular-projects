import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectCartItems,
  selectCartTotal,
  selectDrawerOpen,
  selectTotalItems,
} from '../../../pages/product-cart-page/store/product-cart.selectors';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {
  setItemsInCart,
  toggleCart,
} from '../../../pages/product-cart-page/store/product-cart.actions';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { QuantyControlComponent } from '../quanty-control.component/quanty-control.component';
import { ProductColor, ProductSize } from '../../utils/product';

@Component({
  selector: 'app-drawer-cart',
  imports: [AsyncPipe, ButtonComponent, RouterLink, CurrencyPipe, QuantyControlComponent],
  templateUrl: './drawer-cart.component.html',
  styleUrl: './drawer-cart.component.scss',
})
export class DrawerCartComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  items$ = this.store.select(selectCartItems);
  open$ = this.store.select(selectDrawerOpen);
  totalItems$ = this.store.select(selectTotalItems);
  totalValue$ = this.store.select(selectCartTotal);

  toggleDrawer() {
    this.store.dispatch(toggleCart());
  }

  updateQuantity(product: Product, count: number, size: ProductSize, color: ProductColor) {
    this.store.dispatch(setItemsInCart({ product, count, color, size }));
  }

  navigateToProducts() {
    this.router.navigate(['/product/all']);
    this.toggleDrawer();
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
    this.toggleDrawer();
  }
}

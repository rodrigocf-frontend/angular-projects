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
  toogleCart,
} from '../../../pages/product-cart-page/store/product-cart.actions';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../ui/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-drawer-cart',
  imports: [AsyncPipe, ButtonComponent, RouterLink, CurrencyPipe],
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
    this.store.dispatch(toogleCart());
  }

  updateQuantity(product: Product, count: number) {
    this.store.dispatch(setItemsInCart({ product, count }));
  }

  navigateToProducts() {
    this.router.navigate(['/product/all']);
    this.toggleDrawer();
  }
}

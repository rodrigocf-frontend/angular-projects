import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toogleCart } from '../../../pages/product-cart-page/store/product-cart.actions';
import { selectTotalItems } from '../../../pages/product-cart-page/store/product-cart.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly store = inject(Store);
  totalItems$ = this.store.select(selectTotalItems);

  toggleDrawer() {
    this.store.dispatch(toogleCart());
  }
}

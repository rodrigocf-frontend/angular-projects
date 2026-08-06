import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toogleCart } from '../../../pages/product-cart-page/store/product-cart.actions';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly store = inject(Store);

  toggleDrawer() {
    this.store.dispatch(toogleCart());
  }
}

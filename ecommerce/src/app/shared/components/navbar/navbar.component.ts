import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toogleCart } from '../../../pages/product-cart-page/store/product-cart.actions';
import { selectTotalItems } from '../../../pages/product-cart-page/store/product-cart.selectors';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly store = inject(Store);
  private router = inject(Router);
  totalItems$ = this.store.select(selectTotalItems);
  currentRoute = signal<string>('');

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRoute.set(e.url);
      }
    });
  }

  toggleDrawer() {
    this.store.dispatch(toogleCart());
  }
}

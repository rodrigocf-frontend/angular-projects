import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleCart } from '../../../pages/product-cart-page/store/product-cart.actions';
import { selectTotalItems } from '../../../pages/product-cart-page/store/product-cart.selectors';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly store = inject(Store);
  private route = inject(Router);
  totalItems$ = this.store.select(selectTotalItems);
  currentRoute = signal<string>('');

  constructor() {
    this.route.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentRoute.set(e.url);
      }
    });
  }

  toggleDrawer() {
    this.store.dispatch(toggleCart());
  }
}

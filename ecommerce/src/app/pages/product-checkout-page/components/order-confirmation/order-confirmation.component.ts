import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartTotal } from '../../../product-cart-page/store/product-cart.selectors';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { clearCart } from '../../../product-cart-page/store/product-cart.actions';

@Component({
  selector: 'app-order-confirmation',
  imports: [ButtonComponent, RouterLink, AsyncPipe, CurrencyPipe],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent {
  addressFormat = input.required<string>();
  private readonly store = inject(Store);
  totalValue$ = this.store.select(selectCartTotal);

  cleanCart() {
    this.store.dispatch(clearCart());
  }
}

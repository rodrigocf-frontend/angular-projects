import { Component } from '@angular/core';
import { DrawerCartComponent } from '../../shared/components/drawer-cart/drawer-cart.component';

@Component({
  selector: 'app-product-cart-page',
  imports: [DrawerCartComponent],
  templateUrl: './product-cart-page.component.html',
  styleUrl: './product-cart-page.component.scss',
})
export default class ProductCartPageComponent {}

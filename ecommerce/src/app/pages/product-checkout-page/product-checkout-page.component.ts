import { Component } from '@angular/core';
import { AddressStepComponent } from './components/address-step/address-step.component';
import { ContactStepComponent } from './components/contact-step/contact-step.component';
import { PaymentStepComponent } from './components/payment-step/payment-step.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

@Component({
  selector: 'app-product-checkout-page',
  imports: [
    AddressStepComponent,
    ContactStepComponent,
    PaymentStepComponent,
    OrderSummaryComponent,
  ],
  templateUrl: './product-checkout-page.component.html',
  styleUrl: './product-checkout-page.component.scss',
})
export default class ProductCheckoutPageComponent {}

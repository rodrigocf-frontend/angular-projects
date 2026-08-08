import { Component, ViewEncapsulation } from '@angular/core';
import { AddressStepComponent } from './components/address-step/address-step.component';
import { ContactStepComponent } from './components/contact-step/contact-step.component';
import { PaymentStepComponent } from './components/payment-step/payment-step.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CheckoutStepperComponent } from './components/checkout-stepper/checkout-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

@Component({
  selector: 'app-product-checkout-page',
  imports: [
    AddressStepComponent,
    ContactStepComponent,
    PaymentStepComponent,
    OrderSummaryComponent,
    CheckoutStepperComponent,
    CdkStepperModule,
    OrderConfirmationComponent,
  ],
  templateUrl: './product-checkout-page.component.html',
  styleUrl: './product-checkout-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export default class ProductCheckoutPageComponent {}

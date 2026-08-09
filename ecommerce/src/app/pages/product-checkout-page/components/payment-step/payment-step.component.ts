import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardNumberMaskDirective } from '../../../../shared/directives/card-number-mask.directive';
import { CardExpiryMaskDirective } from '../../../../shared/directives/card-expiry-mask.directive';

@Component({
  selector: 'app-payment-step',
  imports: [ReactiveFormsModule, CardNumberMaskDirective, CardExpiryMaskDirective],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.scss',
})
export class PaymentStepComponent {
  paymentForm = input.required<FormGroup<any>>();
}

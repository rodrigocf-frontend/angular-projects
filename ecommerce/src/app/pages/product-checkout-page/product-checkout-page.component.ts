import { Component, computed, OnInit, signal } from '@angular/core';
import { AddressStepComponent } from './components/address-step/address-step.component';
import { ContactStepComponent } from './components/contact-step/contact-step.component';
import { PaymentStepComponent } from './components/payment-step/payment-step.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CheckoutStepperComponent } from './components/checkout-stepper/checkout-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

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
    ReactiveFormsModule,
  ],
  templateUrl: './product-checkout-page.component.html',
  styleUrl: './product-checkout-page.component.scss',
})
export default class ProductCheckoutPageComponent implements OnInit {
  isSubmitted = signal<boolean>(false);

  addressForm = new FormGroup({
    cep: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]),
    address: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl('', Validators.required),
    complement: new FormControl(''),
    neighborhood: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
  });

  contactForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/),
    ]),
  });

  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/),
    ]),
    cardName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    expiry: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
    ]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
    installments: new FormControl('1'),
  });

  private readonly addressFormValuesChangesSignal = toSignal(this.addressForm.valueChanges, {
    initialValue: this.addressForm.value,
  });

  addressFormat = computed(() => {
    const currentAddress = this.addressFormValuesChangesSignal();
    if (!currentAddress) return '';

    const { cep, address, number, complement, neighborhood, city, state } = currentAddress;

    const streetLine = [address, number].filter(Boolean).join(', ');

    const parts = [
      complement ? `${streetLine} - ${complement}` : streetLine,
      neighborhood,
      [city, state].filter(Boolean).join(' - '),
      cep,
    ].filter(Boolean);

    return parts.join(', ');
  });

  ngOnInit(): void {
    this.loadProgress();
  }

  onAddressFormSubmit() {
    this.saveProgress();
  }

  onContactFormSubmit() {
    this.saveProgress();
  }

  onPaymentFormSubmit() {
    this.deleteProgress();
    this.isSubmitted.set(true);
  }

  loadProgress() {
    const data = localStorage.getItem('maison_checkout');
    if (data) {
      const dataToJSON = JSON.parse(data);
      this.addressForm.reset({
        ...dataToJSON.addressForm,
      });

      this.contactForm.reset({
        ...dataToJSON.contactForm,
      });
    }
  }

  saveProgress() {
    localStorage.setItem(
      'maison_checkout',
      JSON.stringify({
        addressForm: this.addressForm.value,
        contactForm: this.contactForm.value,
      }),
    );
  }

  deleteProgress() {
    localStorage.removeItem('maison_checkout');
  }
}

import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface StepCheckoutI {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-checkout-stepper',
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss',
  providers: [{ provide: CdkStepper, useExisting: CheckoutStepperComponent }],
  imports: [NgTemplateOutlet, CdkStepperModule, ButtonComponent, ReactiveFormsModule],
})
export class CheckoutStepperComponent extends CdkStepper {
  private readonly destroyRef = inject(DestroyRef);

  addressForm = input.required<FormGroup<any>>();
  contactForm = input.required<FormGroup<any>>();
  paymentForm = input.required<FormGroup<any>>();

  onAddressFormSubmit = output();
  onContactFormSubmit = output();
  onPaymentFormSubmit = output();

  isSubmittingPayment = signal(false);

  stepsCheckout = signal<StepCheckoutI[]>([
    {
      checked: false,
      label: 'Sacola',
    },
    {
      checked: false,
      label: 'Entrega',
    },
    {
      checked: false,
      label: 'Pagamento',
    },
    {
      checked: false,
      label: 'Confirmação',
    },
  ]);

  selectStepByIndex(index: number): void {
    if (index === 0) {
      if (this.addressForm().valid) {
        this.onAddressFormSubmit.emit();
        this.nextStep(index);
      } else {
        this.addressForm().markAllAsTouched();
      }
      return;
    }
    if (index === 1) {
      if (this.contactForm().valid) {
        this.onContactFormSubmit.emit();
        this.nextStep(index);
      } else {
        this.contactForm().markAllAsTouched();
      }
      return;
    }
    if (index === 2) {
      if (this.isSubmittingPayment()) return;
      if (this.paymentForm().valid) {
        this.submitPayment(index);
      } else {
        this.paymentForm().markAllAsTouched();
      }
      return;
    }
  }

  private submitPayment(index: number) {
    this.isSubmittingPayment.set(true);

    const timeoutId = setTimeout(() => {
      this.isSubmittingPayment.set(false);
      this.onPaymentFormSubmit.emit();
      this.nextStep(index);
    }, 2000);

    this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
  }

  nextStep(index: number) {
    this.selectedIndex = index + 1;

    this.stepsCheckout.update((prevState) =>
      prevState.map((stp, stpIndex) => {
        if (index === stpIndex) {
          return {
            ...stp,
            checked: true,
          };
        }
        if (index + 1 === 3) {
          return {
            ...stp,
            checked: true,
          };
        }
        return stp;
      }),
    );
  }
}

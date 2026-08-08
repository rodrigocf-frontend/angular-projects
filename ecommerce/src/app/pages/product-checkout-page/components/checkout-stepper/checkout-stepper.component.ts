import { Component, signal } from '@angular/core';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

interface StepCheckoutI {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-checkout-stepper',
  templateUrl: './checkout-stepper.component.html',
  styleUrl: './checkout-stepper.component.scss',
  providers: [{ provide: CdkStepper, useExisting: CheckoutStepperComponent }],
  imports: [NgTemplateOutlet, CdkStepperModule, ButtonComponent],
})
export class CheckoutStepperComponent extends CdkStepper {
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

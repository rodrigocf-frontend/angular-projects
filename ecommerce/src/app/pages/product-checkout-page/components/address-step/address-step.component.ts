import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CepMaskDirective } from '../../../../shared/directives/cep-mask.directive';

@Component({
  selector: 'app-address-step',
  imports: [ReactiveFormsModule, CepMaskDirective],
  templateUrl: './address-step.component.html',
  styleUrl: './address-step.component.scss',
})
export class AddressStepComponent {
  addressForm = input.required<FormGroup<any>>();
}

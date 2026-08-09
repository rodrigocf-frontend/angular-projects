import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PhoneMaskDirective } from '../../../../shared/directives/phone-mask.directive';

@Component({
  selector: 'app-contact-step',
  imports: [ReactiveFormsModule, PhoneMaskDirective],
  templateUrl: './contact-step.component.html',
  styleUrl: './contact-step.component.scss',
})
export class ContactStepComponent {
  contactForm = input.required<FormGroup<any>>();
}

import { Component, input } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  imports: [ButtonComponent, RouterLink, CurrencyPipe],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
})
export class OrderConfirmationComponent {
  addressFormat = input.required<string>();
  total = input.required<number>();
}

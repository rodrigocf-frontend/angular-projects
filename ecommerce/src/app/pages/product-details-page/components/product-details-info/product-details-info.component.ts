import { Component, computed, input } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details-info',
  imports: [CurrencyPipe],
  templateUrl: './product-details-info.component.html',
  styleUrl: './product-details-info.component.scss',
})
export class ProductDetailsInfoComponent {
  data = input.required<Product>();

  readonly nameParts = computed(() => {
    const words = this.data().name.trim().split(/\s+/);

    const emphasis = words.pop() ?? '';
    return { title: words.join(' '), emphasis };
  });
}

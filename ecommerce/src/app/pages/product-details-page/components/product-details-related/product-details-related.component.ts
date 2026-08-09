import { Component, input, output } from '@angular/core';
import { Product } from '../../../../shared/models/product.model';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { scrollToTop } from '../../../../shared/utils/scroller';

@Component({
  selector: 'app-product-details-related',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details-related.component.html',
  styleUrl: './product-details-related.component.scss',
})
export class ProductDetailsRelatedComponent {
  data = input.required<Product[]>();
  onClickCardReset = output();

  onClickRelatedProduct() {
    scrollToTop();
    this.onClickCardReset.emit();
  }
}

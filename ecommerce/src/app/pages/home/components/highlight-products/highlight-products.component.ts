import { Component, input } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { Product } from '../../../../shared/models/product.model';
import { Pagination } from '../../../../core/services/product/products.service';
import { getProductColors } from '../../../../shared/utils/product';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { scrollToTop } from '../../../../shared/utils/scroller';

@Component({
  selector: 'app-highlight-products',
  imports: [SectionHeaderComponent, CurrencyPipe, RouterLink],
  templateUrl: './highlight-products.component.html',
  styleUrl: './highlight-products.component.scss',
})
export class HighlightProductsComponent {
  data = input.required<Pagination<Product>>();

  getColors = getProductColors;

  scrollTo = scrollToTop;
}

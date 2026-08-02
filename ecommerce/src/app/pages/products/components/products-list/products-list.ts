import { Component, computed, inject } from '@angular/core';
import { ProductFilterService } from '../../../../core/services/product/product-filter.service';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-list',
  imports: [CurrencyPipe],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  private productsFilterService = inject(ProductFilterService);
  products = toSignal(this.productsFilterService.productsFiltered$);
  p = computed(() => this.products());

  getSizes(product: Product): string[] {
    return product.sizes.split(',');
  }
}

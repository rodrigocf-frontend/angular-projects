import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { EmptyListComponent } from '../empty-list/empty-list.component';

@Component({
  selector: 'app-products-list',
  imports: [CurrencyPipe, EmptyListComponent],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  data = input.required<Product[]>();

  getSizes(product: Product): string[] {
    return product.sizes.split(',');
  }
}

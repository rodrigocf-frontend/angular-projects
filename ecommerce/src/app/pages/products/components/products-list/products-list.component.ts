import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-list',
  imports: [CurrencyPipe, EmptyListComponent, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  data = input.required<Product[]>();

  getSizes(product: Product): { label: string; available: boolean }[] {
    return product.sizes.split(',').map((entry) => {
      const [label, available] = entry.split(':');
      return { label, available: available === 'true' };
    });
  }

  getColors(product: Product): { name: string; hex: string }[] {
    return product.colors.split(',').map((entry) => {
      const [name, hex] = entry.split(':');
      return { name, hex };
    });
  }
}

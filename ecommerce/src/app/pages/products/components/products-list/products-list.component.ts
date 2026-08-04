import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { RouterLink } from '@angular/router';
import { getProductColors, getProductsSizes } from '../../../../shared/utils/product';

@Component({
  selector: 'app-products-list',
  imports: [CurrencyPipe, EmptyListComponent, RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent {
  data = input.required<Product[]>();

  getColors = getProductColors;

  getSizes = getProductsSizes;
}

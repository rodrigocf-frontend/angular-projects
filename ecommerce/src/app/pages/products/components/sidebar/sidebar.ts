import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProductFilter } from '../../store/products/products.reducer';
import { ProductFilterService } from '../../../../core/services/product/product-filter.service';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private productsFilterService = inject(ProductFilterService);
  categories$ = this.productsFilterService.categories$;

  handleFilter(item: ProductFilter) {
    this.productsFilterService.startFilter(item);
  }
  clearFilter() {
    this.productsFilterService.clearFilter();
  }
}

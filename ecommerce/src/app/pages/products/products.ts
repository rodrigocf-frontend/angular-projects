import { Component, inject, OnInit } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { Sidebar } from './components/sidebar/sidebar';
import { ProductsList } from './components/products-list/products-list';
import { Pagination } from './components/pagination/pagination';
import { ProductFilter } from './store/products/products.reducer';
import { AsyncPipe } from '@angular/common';
import { ProductFilterService } from '../../core/services/product/product-filter.service';

@Component({
  selector: 'app-products',
  imports: [Breadcrumb, Sidebar, ProductsList, Pagination, AsyncPipe],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class Products implements OnInit {
  private productsFilterService = inject(ProductFilterService);
  filtersActives$ = this.productsFilterService.filtersActives$;

  ngOnInit(): void {
    this.productsFilterService.syncProducts();
  }

  handleFilter(item: ProductFilter) {
    this.productsFilterService.startFilter(item);
  }
  clearFilter() {
    this.productsFilterService.clearFilter();
  }
}

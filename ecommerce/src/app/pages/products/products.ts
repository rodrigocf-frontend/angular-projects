import { Component, inject, OnInit } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { Sidebar } from './components/sidebar/sidebar';
import { ProductsList } from './components/products-list/products-list';
import { Pagination } from './components/pagination/pagination';
import { isPriceFilter, ProductFilter, SortFilter } from './store/products/products.reducers';
import { AsyncPipe } from '@angular/common';
import { ProductFilterService } from '../../core/services/product/product-filter.service';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSort } from './store/products/products.actions';

@Component({
  selector: 'app-products',
  imports: [Breadcrumb, Sidebar, ProductsList, Pagination, AsyncPipe],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class Products implements OnInit {
  private productsFilterService = inject(ProductFilterService);
  private store = inject(Store);
  filtersActives$ = this.productsFilterService.filtersActives$.pipe(
    map((value) =>
      value.map((i) => {
        if (isPriceFilter(i)) {
          return {
            ...i,
            name: `Min. R$${i.value}`,
          };
        }
        if (isPriceFilter(i)) {
          return {
            ...i,
            name: `Máx. R$ ${i.value}`,
          };
        }
        return i;
      }),
    ),
  );

  productsPagination$ = this.productsFilterService.productsPagination$;

  readonly orderSelects: SortFilter[] = [
    {
      name: 'Relevância',
      type: 'relevance',
    },
    {
      name: 'Menor Preço',
      type: 'min-price',
    },
    {
      name: 'Maior Preço',
      type: 'max-price',
    },
    {
      name: 'Novidades',
      type: 'newest',
    },
  ];

  ngOnInit(): void {
    this.productsFilterService.syncProducts();
  }

  handleFilter(item: ProductFilter) {
    this.productsFilterService.startFilter(item);
  }

  onSelectOrder(type: string) {
    const sort = this.orderSelects.find((item) => item.type === type);
    if (sort) {
      this.store.dispatch(
        setSort({
          sort,
        }),
      );
    }
  }
}

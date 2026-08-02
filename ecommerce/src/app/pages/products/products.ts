import { Component, inject, OnInit } from '@angular/core';
import { Breadcrumb } from './components/breadcrumb/breadcrumb';
import { Sidebar } from './components/sidebar/sidebar';
import { ProductsList } from './components/products-list/products-list';
import { Pagination } from './components/pagination/pagination';
import {
  isCategoryFilter,
  isColorFilter,
  isPriceFilter,
  isSizeFilter,
  ProductFilter,
  SortFilter,
} from './store/products/products.reducers';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { FilterType, loadProducts, setFilter, setSort } from './store/products/products.actions';
import { LoadingListComponent } from './components/loading-list/loading-list.component';
import {
  selectCheckedPagination,
  selectFiltersActives,
  selectIsLoading,
  selectProductsFiltereds,
} from './store/products/products.selectors';

@Component({
  selector: 'app-products',
  imports: [Breadcrumb, Sidebar, AsyncPipe, LoadingListComponent, ProductsList, Pagination],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export default class Products implements OnInit {
  private store = inject(Store);

  isLoading$ = this.store.select(selectIsLoading);
  readonly productsData$ = this.store.select(selectProductsFiltereds);
  readonly filtersActives$ = this.store.select(selectFiltersActives).pipe(
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

  readonly productsPagination$ = this.store.select(selectCheckedPagination);

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
    this.store.dispatch(loadProducts({ page: 1 }));
  }

  handleFilter(filter: ProductFilter) {
    if (isColorFilter(filter)) {
      this.store.dispatch(setFilter({ page: 1, filterType: FilterType.color, color: filter }));
    }

    if (isCategoryFilter(filter)) {
      this.store.dispatch(
        setFilter({ page: 1, filterType: FilterType.category, category: filter }),
      );
    }

    if (isSizeFilter(filter)) {
      this.store.dispatch(setFilter({ page: 1, filterType: FilterType.size, size: filter }));
    }
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

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { PaginationComponent } from './components/pagination/pagination.component';
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
  selectFilters,
  selectFiltersActives,
  selectIsLoading,
  selectProductsFiltereds,
} from './store/products/products.selectors';
import { ActivatedRoute } from '@angular/router';
import { getRouteParams } from '../../shared/utils/filters';

@Component({
  selector: 'app-products',
  imports: [
    BreadcrumbComponent,
    SidebarComponent,
    AsyncPipe,
    LoadingListComponent,
    ProductsListComponent,
    PaginationComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export default class ProductsComponent implements OnInit {
  private store = inject(Store);

  isLoading$ = this.store.select(selectIsLoading);
  readonly productsPagination$ = this.store.select(selectCheckedPagination);
  readonly productsData$ = this.store.select(selectProductsFiltereds);
  private readonly route = inject(ActivatedRoute);

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

  readonly currentSortType$ = this.store
    .select(selectFilters)
    .pipe(map((filters) => filters.sort[0]?.type ?? 'relevance'));

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const sort: SortFilter[] = getRouteParams(this.route);
      this.store.dispatch(loadProducts({ page: 1, sort }));
    });
  }

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

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
import { debounceTime, map, skip } from 'rxjs';
import { Store } from '@ngrx/store';
import { FilterType, loadProducts, setFilter, setSort } from './store/products/products.actions';
import { LoadingListComponent } from './components/loading-list/loading-list.component';
import {
  selectCheckedFilters,
  selectCheckedPagination,
  selectFilters,
  selectFiltersActives,
  selectHasError,
  selectIsLoading,
  selectProductsFiltereds,
} from './store/products/products.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { getRouteParams } from '../../shared/utils/filters';
import { ListErrorComponent } from './components/list-error/list-error.component';

@Component({
  selector: 'app-products',
  imports: [
    BreadcrumbComponent,
    SidebarComponent,
    AsyncPipe,
    LoadingListComponent,
    ProductsListComponent,
    PaginationComponent,
    ListErrorComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export default class ProductsComponent implements OnInit {
  private store = inject(Store);

  isLoading$ = this.store.select(selectIsLoading);
  readonly hasError$ = this.store.select(selectHasError);
  readonly productsPagination$ = this.store.select(selectCheckedPagination);
  readonly productsData$ = this.store.select(selectProductsFiltereds);
  private readonly router = inject(Router);
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

  verifyFilterQueryParams$ = toObservable(this.store.selectSignal(selectCheckedFilters))
    .pipe(skip(1), debounceTime(100))
    .subscribe((filters) => {
      this.updateQueryParams(filters);
    });

  ngOnInit(): void {
    this.loadInitialProducts();
  }

  loadInitialProducts(): void {
    const { categories, sort } = getRouteParams(this.route);
    this.store.dispatch(loadProducts({ page: 1, categories, sort }));
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
  private updateQueryParams(filters: any) {
    const params: Record<string, string> = {};
    const categories = filters.categories.map((c: any) => c.name).join(',');
    if (categories) params['category'] = categories;
    const sizes = filters.sizes.map((s: any) => s.name).join(',');
    if (sizes) params['size'] = sizes;
    const colors = filters.colors.map((c: any) => c.name).join(',');
    if (colors) params['color'] = colors;
    if (filters.fromPrice.value > 0) params['priceMin'] = filters.fromPrice.value;
    if (filters.toPrice.value > 0) params['priceMax'] = filters.toPrice.value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'replace', // substitui os params atuais
      replaceUrl: true, // não cria entrada no histórico a cada filtro
    });
  }
}

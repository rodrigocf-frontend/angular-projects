import { inject, Injectable } from '@angular/core';
import {
  CategoryFilter,
  ColorFilter,
  isCategoryFilter,
  isColorFilter,
  isSizeFilter,
  ProductFilter,
  SizeFilter,
} from '../../../pages/products/store/products/products.reducers';
import {
  clearFilter,
  FilterType,
  loadProducts,
  setFilter,
} from '../../../pages/products/store/products/products.actions';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import {
  selectFilters,
  selectFiltersActives,
  selectProductsFiltereds,
  selectProductsPagination,
} from '../../../pages/products/store/products/products.selectors';
import { HttpClient } from '@angular/common/http';

export interface CategoryFilterFromApi extends Omit<CategoryFilter, 'checked'> {}
export interface SizeFilterFromApi extends Omit<SizeFilter, 'checked'> {}
export interface ColorFilterFromApi extends Omit<ColorFilter, 'checked'> {}

export interface FiltersApiResponse {
  categories: CategoryFilterFromApi[];
  sizes: SizeFilterFromApi[];
  colors: ColorFilter[];
}

@Injectable({ providedIn: 'root' })
export class ProductFilterService {
  private store = inject(Store);
  private readonly http = inject(HttpClient);
  readonly filtersActives$ = this.store.select(selectFiltersActives);
  readonly productsFiltered$ = this.store.select(selectProductsFiltereds);
  readonly productsPagination$ = this.store.select(selectProductsPagination);

  readonly categories$: Observable<{
    sizes: SizeFilter[];
    categories: CategoryFilter[];
    colors: ColorFilter[];
  }> = this.store.select(selectFilters);

  syncProducts() {
    this.store.dispatch(loadProducts({ page: 1 }));
  }

  startFilter(filter: ProductFilter) {
    if (isColorFilter(filter)) {
      this.store.dispatch(setFilter({ filterType: FilterType.color, color: filter }));
    }

    if (isCategoryFilter(filter)) {
      this.store.dispatch(setFilter({ filterType: FilterType.category, category: filter }));
    }

    if (isSizeFilter(filter)) {
      this.store.dispatch(setFilter({ filterType: FilterType.size, size: filter }));
    }
  }

  getFilters() {
    return this.http.get<FiltersApiResponse>(`http://localhost:3000/filters`);
  }

  clearFilter() {
    this.store.dispatch(clearFilter());
  }
}

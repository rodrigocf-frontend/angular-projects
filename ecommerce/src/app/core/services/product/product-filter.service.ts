import { inject, Injectable } from '@angular/core';
import {
  CategoryFilter,
  ColorFilter,
  isCategoryFilter,
  isColorFilter,
  isSizeFilter,
  ProductFilter,
  selectFilters,
  selectFiltersActives,
  SizeFilter,
} from '../../../pages/products/store/products/products.reducer';
import {
  clearFilter,
  FilterType,
  setFilter,
  setProducts,
} from '../../../pages/products/store/products/products.action';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductFilterService {
  private store = inject(Store);
  readonly filtersActives$ = this.store.select(selectFiltersActives);

  readonly categories$: Observable<{
    sizes: SizeFilter[];
    categories: CategoryFilter[];
    colors: ColorFilter[];
  }> = this.store.select(selectFilters);

  syncProducts() {
    this.store.dispatch(
      setProducts({
        products: ALL_PRODUCTS_MOCK,
      }),
    );
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

  clearFilter() {
    this.store.dispatch(clearFilter());
  }
}

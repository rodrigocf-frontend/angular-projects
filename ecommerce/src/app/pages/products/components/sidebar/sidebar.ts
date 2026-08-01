import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProductFilter } from '../../store/products/products.reducers';
import { ProductFilterService } from '../../../../core/services/product/product-filter.service';
import { Store } from '@ngrx/store';
import { isNumber, tap, toNumber } from 'lodash-es';
import { FilterType, setFilter } from '../../store/products/products.actions';
import { selectFilters } from '../../store/products/products.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private productsFilterService = inject(ProductFilterService);
  private store = inject(Store);
  categories$ = this.productsFilterService.categories$;

  constructor() {
    this.store.select(selectFilters).pipe(takeUntilDestroyed());
  }

  handleFilter(item: ProductFilter) {
    console.log(item);
    this.productsFilterService.startFilter(item);
  }
  clearFilter() {
    this.productsFilterService.clearFilter();
  }

  onChangePrice(value: string, type: 'from' | 'to') {
    const valueToNumber = toNumber(value);
    if (isNumber(valueToNumber)) {
      if (type === 'from') {
        this.store.dispatch(
          setFilter({
            filterType: FilterType.price,
            price: {
              type: 'fromPrice',
              name: '',
              value: valueToNumber,
              checked: true,
            },
          }),
        );
      } else if (type === 'to') {
        this.store.dispatch(
          setFilter({
            filterType: FilterType.price,
            price: {
              type: 'toPrice',
              name: '',
              value: valueToNumber,
              checked: true,
            },
          }),
        );
      }
    }
  }
}

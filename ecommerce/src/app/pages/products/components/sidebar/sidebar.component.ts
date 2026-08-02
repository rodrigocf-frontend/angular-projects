import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  CategoryFilter,
  ColorFilter,
  isCategoryFilter,
  isColorFilter,
  isSizeFilter,
  ProductFilter,
  SizeFilter,
} from '../../store/products/products.reducers';
import { Store } from '@ngrx/store';
import { clearFilter, FilterType, setFilter } from '../../store/products/products.actions';
import { selectFilters } from '../../store/products/products.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scrollBehaviorTo } from '../../../../shared/utils/scroller';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { CurrencyMaskDirective } from '../../../../shared/directives/mask.directive';
import { cleanDigits } from '../../../../shared/utils/currency';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, ReactiveFormsModule, CurrencyMaskDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private store = inject(Store);

  readonly categories$: Observable<{
    sizes: SizeFilter[];
    categories: CategoryFilter[];
    colors: ColorFilter[];
  }> = this.store.select(selectFilters);

  fromPrice = new FormControl<string>('');
  toPrice = new FormControl<string>('');

  constructor() {
    this.store.select(selectFilters).pipe(takeUntilDestroyed());
  }

  ngOnInit(): void {
    this.fromPrice.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((price) => {
          if (price !== null) {
            return [
              this.store.dispatch(
                setFilter({
                  page: 1,
                  filterType: FilterType.price,
                  price: {
                    type: 'fromPrice',
                    name: '',
                    value: price ? cleanDigits(price) : 0,
                  },
                }),
              ),
            ];
          }
          return [];
        }),
      )
      .subscribe();

    this.toPrice.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((price) => {
          if (price !== null) {
            return [
              this.store.dispatch(
                setFilter({
                  page: 1,
                  filterType: FilterType.price,
                  price: {
                    type: 'toPrice',
                    name: '',
                    value: price ? cleanDigits(price) : 0,
                  },
                }),
              ),
            ];
          }
          return [];
        }),
      )
      .subscribe();
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
    scrollBehaviorTo('#products-list');
  }

  clearFilter() {
    this.store.dispatch(clearFilter({ page: 1 }));
    this.fromPrice.reset(null);
    this.toPrice.reset(null);
    scrollBehaviorTo('#products-list');
  }
}

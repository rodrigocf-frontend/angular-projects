import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProductFilter } from '../../store/products/products.reducers';
import { ProductFilterService } from '../../../../core/services/product/product-filter.service';
import { Store } from '@ngrx/store';
import { FilterType, setFilter } from '../../store/products/products.actions';
import { selectFilters } from '../../store/products/products.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scrollBehaviorTo } from '../../../../shared/utils/scroller';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CurrencyMaskDirective } from '../../../../shared/directives/mask.directive';
import { cleanDigits } from '../../../../shared/utils/currency';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, ReactiveFormsModule, CurrencyMaskDirective],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private productsFilterService = inject(ProductFilterService);
  private store = inject(Store);

  categories$ = this.productsFilterService.categories$;

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

  handleFilter(item: ProductFilter) {
    this.productsFilterService.startFilter(item);
    scrollBehaviorTo('#products-list');
  }

  clearFilter() {
    this.productsFilterService.clearFilter();
    this.fromPrice.reset(null);
    this.toPrice.reset(null);
    scrollBehaviorTo('#products-list');
  }
}

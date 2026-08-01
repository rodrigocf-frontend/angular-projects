import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changePage,
  loadProducts,
  setFilter,
  setProducts,
  setupProductsFilter,
} from './products.actions';
import { forkJoin, switchMap } from 'rxjs';
import { ProductService } from '../../../../core/services/product/products.service';
import { Store } from '@ngrx/store';
import { selectCheckedCategories } from './products.selectors';
import { ProductFilterService } from '../../../../core/services/product/product-filter.service';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class ProductsPageEffects {
  private action$ = inject(Actions);
  private productsService = inject(ProductService);
  private productsFilterService = inject(ProductFilterService);

  private store = inject(Store);

  private readonly loadProducts$ = createEffect(() => {
    return this.action$.pipe(ofType(loadProducts)).pipe(
      switchMap(({ page }) => {
        return forkJoin({
          products: this.productsService.getProducts({ page }),
          filters: this.productsFilterService.getFilters(),
        }).pipe(
          switchMap(
            ({ products: { data, ...pagination }, filters: { categories, colors, sizes } }) => [
              setProducts({ products: data }),
              setupProductsFilter({
                products: data,
                pagination: {
                  ...pagination,
                  current: page,
                },
                filters: {
                  categories,
                  colors,
                  sizes,
                },
              }),
            ],
          ),
        );
      }),
    );
  });

  private readonly loadFilter$ = createEffect(() => {
    return this.action$.pipe(ofType(setFilter)).pipe(
      concatLatestFrom(() => this.store.select(selectCheckedCategories)),
      switchMap(([_, categories]) => {
        return this.productsService
          .getProducts({ page: 1, categories })
          .pipe(switchMap(({ data }) => [setProducts({ products: data })]));
      }),
    );
  });

  private readonly changePage$ = createEffect(() => {
    return this.action$.pipe(ofType(changePage)).pipe(
      concatLatestFrom(() => this.store.select(selectCheckedCategories)),
      switchMap(([{ page }, categories]) => {
        return this.productsService
          .getProducts({ page, categories })
          .pipe(switchMap(({ data }) => [setProducts({ products: data })]));
      }),
    );
  });
}

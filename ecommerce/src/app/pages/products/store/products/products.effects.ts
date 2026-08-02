import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changePage,
  clearFilter,
  loadProducts,
  setFilter,
  setProducts,
  configFilters,
  configPagination,
  setPagination,
  setSort,
  setLoading,
} from './products.actions';
import { forkJoin, switchMap } from 'rxjs';
import { ProductService } from '../../../../core/services/product/products.service';
import { Store } from '@ngrx/store';
import { selectCheckedFilters, selectCheckedPagination } from './products.selectors';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class ProductsPageEffects {
  private action$ = inject(Actions);
  private productsService = inject(ProductService);

  private store = inject(Store);

  private readonly loadProducts$ = createEffect(() => {
    return this.action$.pipe(ofType(loadProducts, clearFilter)).pipe(
      switchMap(({ page }) => {
        return forkJoin({
          products: this.productsService.getProducts({ page }),
          filters: this.productsService.getFilters(),
        }).pipe(
          switchMap(
            ({ products: { data, ...pagination }, filters: { categories, colors, sizes } }) => [
              setProducts({ products: data }),
              configFilters({
                products: data,
                filters: {
                  categories,
                  colors,
                  sizes,
                },
              }),
              configPagination({
                pagination,
              }),
              setLoading({
                isLoading: false,
              }),
            ],
          ),
        );
      }),
    );
  });

  private readonly loadFilter$ = createEffect(() => {
    return this.action$.pipe(ofType(setFilter, changePage, setSort)).pipe(
      concatLatestFrom(() => [
        this.store.select(selectCheckedFilters),
        this.store.select(selectCheckedPagination),
      ]),
      switchMap(([action, { categories, colors, sizes, fromPrice, toPrice, sort }]) => {
        const page = action.type === changePage.type ? action.page : 1;
        return this.productsService
          .getProducts({ page, categories, colors, sizes, fromPrice, toPrice, sort })
          .pipe(
            switchMap(({ data, ...pagination }) => [
              setProducts({ products: data }),
              setPagination({
                pagination: {
                  ...pagination,
                  current: page,
                },
              }),
              setLoading({
                isLoading: false,
              }),
            ]),
          );
      }),
    );
  });

  private readonly isLoadingFilter$ = createEffect(() => {
    return this.action$.pipe(ofType(setFilter, changePage, setSort)).pipe(
      switchMap(() => [
        setLoading({
          isLoading: true,
        }),
      ]),
    );
  });
}

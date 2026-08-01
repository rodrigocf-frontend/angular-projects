import { computed, inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadProducts, setProducts, setupProductsFilter } from './products.actions';
import { switchMap } from 'rxjs';
import { ProductService } from '../../../../core/services/product/products.service';
import { Store } from '@ngrx/store';
import { selectProductsPagination } from './products.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class ProductsEffects {
  private action$ = inject(Actions);
  private productsService = inject(ProductService);
  private store = inject(Store);
  private pagination = toSignal(this.store.select(selectProductsPagination));

  loadProducts$ = createEffect(() => {
    return this.action$.pipe(ofType(loadProducts)).pipe(
      switchMap(({ page }) => {
        return this.productsService
          .getProducts({
            page,
          })
          .pipe(
            switchMap(({ data, ...pagination }) => [
              setProducts({ products: data }),
              setupProductsFilter({
                products: data,
                pagination: {
                  ...pagination,
                  current: page,
                },
              }),
            ]),
          );
      }),
    );
  });
}

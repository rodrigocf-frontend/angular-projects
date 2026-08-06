import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addProductInCart, setItemsInCart } from './product-cart.actions';
import { switchMap } from 'rxjs';
import { ProductService } from '../../../core/services/product/products.service';

@Injectable()
export class ProductCartEffects {
  private readonly actions$ = inject(Actions);
  private readonly productService = inject(ProductService);

  $onAddProductInCart = createEffect(() =>
    this.actions$
      .pipe(ofType(addProductInCart))
      .pipe(
        switchMap(({ id, count, color, size }) =>
          this.productService
            .getProduct(id)
            .pipe(switchMap((product) => [setItemsInCart({ product, count, color, size })])),
        ),
      ),
  );
}

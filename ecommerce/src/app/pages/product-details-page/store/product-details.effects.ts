import { inject, Injectable } from '@angular/core';
import { ProductService } from '../../../core/services/product/products.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { loadProduct, setProduct, setRelatedProducts } from './product-details.actions';

@Injectable()
export class ProductsDetailsPageEffects {
  private readonly productService = inject(ProductService);
  private readonly actions$ = inject(Actions);

  $loadPage = createEffect(() =>
    this.actions$.pipe(ofType(loadProduct)).pipe(
      switchMap(({ id }) =>
        this.productService.getProduct(id).pipe(
          switchMap((product) =>
            this.productService.getRelatedProducts(product).pipe(
              switchMap(({ data }) => [
                setProduct({
                  product,
                }),
                setRelatedProducts({
                  products: data,
                }),
              ]),
            ),
          ),
        ),
      ),
    ),
  );
}

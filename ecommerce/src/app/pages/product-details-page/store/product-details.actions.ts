import { createAction, props } from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';

export const loadProduct = createAction(
  '[Product Details Page] - load product',
  props<{ id: string }>(),
);

export const setProduct = createAction(
  '[Product Details Page] - set product',
  props<{ product: Product }>(),
);

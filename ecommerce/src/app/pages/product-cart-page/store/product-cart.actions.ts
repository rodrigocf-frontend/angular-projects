import { createAction, props } from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';
import { ProductColor, ProductSize } from '../../../shared/utils/product';

export const toggleCart = createAction('[Drawer Cart] - toogle');
export const addProductInCart = createAction(
  '[Cart] - get and add product on cart',
  props<{ id: string; count?: number; color: ProductColor; size: ProductSize }>(),
);

export const setItemsInCart = createAction(
  '[Cart] - set product on cart itens',
  props<{ product: Product; count?: number; color: ProductColor; size: ProductSize }>(),
);

export const clearCart = createAction('[Cart] - clear products on cart');

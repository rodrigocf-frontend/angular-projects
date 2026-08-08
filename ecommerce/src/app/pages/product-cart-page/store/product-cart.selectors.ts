import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState, PRODUCT_CART_STORE_KEY } from './product-cart.reducers';

const selectCartFeature = createFeatureSelector<CartState>(PRODUCT_CART_STORE_KEY);

export const selectCartItems = createSelector(selectCartFeature, (state) => state.items);
export const selectDrawerOpen = createSelector(selectCartFeature, (state) => state.open);

export const selectTotalItems = createSelector(selectCartFeature, (state) => state.items.length);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.product.price * item.count, 0),
);

export const selectCartIsEmpty = createSelector(
  selectCartFeature,
  (state) => state.items.length <= 0,
);

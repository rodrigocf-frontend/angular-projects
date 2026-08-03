import { createSelector } from '@ngrx/store';
import { ProductDetailsFeatures, ProductDetailsState } from './product-details.reducers';

export const selectProductDetailsState = (state: ProductDetailsFeatures) => state.productDetails;

export const selectProduct = createSelector(
  selectProductDetailsState,
  (state: ProductDetailsState) => state.product,
);

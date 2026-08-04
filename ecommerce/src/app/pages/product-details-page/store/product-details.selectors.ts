import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductDetailsState } from './product-details.reducers';

export const selectFeature = createFeatureSelector<ProductDetailsState>('productDetails');

export const selectProduct = createSelector(
  selectFeature,
  (state: ProductDetailsState) => state.product,
);

export const selectRelatedProducts = createSelector(
  selectFeature,
  (state: ProductDetailsState) => state.relatedProducts,
);

export const selectDetailsPageLoading = createSelector(
  selectFeature,
  (state: ProductDetailsState) => state.isLoading,
);

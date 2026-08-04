import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';
import { setIsLoading, setProduct, setRelatedProducts } from './product-details.actions';

export type ProductDetailsState = {
  product: Product | null;
  relatedProducts: Product[];
  isLoading: boolean;
};

const initialState: ProductDetailsState = {
  product: null,
  relatedProducts: [],
  isLoading: true,
};

export const productsDetailsReducer = createReducer(
  initialState,
  on(setProduct, (state, { product }) => {
    return {
      ...state,
      product,
    };
  }),
  on(setRelatedProducts, (state, { products }) => {
    return {
      ...state,
      relatedProducts: products,
    };
  }),

  on(setIsLoading, (state, { isLoading }) => {
    return {
      ...state,
      isLoading,
    };
  }),
);

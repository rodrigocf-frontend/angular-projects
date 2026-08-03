import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';
import { setProduct } from './product-details.actions';

export type ProductDetailsState = {
  product: Product;
};

export type ProductDetailsFeatures = {
  productDetails: ProductDetailsState;
};

const initialState: ProductDetailsState = {
  product: {
    brand: '',
    careInstructions: [],
    category: '',
    colors: '',
    composition: [],
    createdAt: '',
    description: '',
    details: [],
    discount: 0,
    id: '',
    images: [],
    isNew: false,
    isSale: false,
    name: '',
    originalPrice: 0,
    price: 0,
    rating: 0,
    reviewCount: 0,
    sizes: '',
    tags: [],
  },
};

export const productsDetailsReducer = createReducer(
  initialState,
  on(setProduct, (state, { product }) => {
    return {
      ...state,
      product,
    };
  }),
);

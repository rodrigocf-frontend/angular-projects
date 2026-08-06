import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';
import { setItemsInCart, toogleCart } from './product-cart.actions';

export const PRODUCT_CART_STORE_KEY = 'cart';

export type CartProductItem = {
  count: number;
  product: Product;
};

export interface CartState {
  items: CartProductItem[];
  open: boolean;
}

const initialCartState: CartState = {
  items: [],
  open: false,
};

export const cartReducers = createReducer(
  initialCartState,
  on(toogleCart, (state) => {
    return {
      ...state,
      open: !state.open,
    };
  }),
  on(setItemsInCart, (state, { product, count }) => {
    const cartItem = searchProductOnCart(state, product);

    if (!cartItem) {
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: product,
            count: 1,
          },
        ],
      };
    }
    return {
      ...state,
      items: [...updateCartItemCount(state, cartItem, count)],
    };
  }),
);

const searchProductOnCart = (state: CartState, product: Product) =>
  state.items.find((i) => i.product.id === product.id);

const updateCartItemCount = (state: CartState, cartItem: CartProductItem, count?: number) => {
  if (count === 0) {
    return state.items.filter((i) => i.product.id !== cartItem.product.id);
  }
  return state.items.map((i) => {
    if (i.product.id === cartItem.product.id) {
      return {
        ...i,
        count: count ? count : i.count + 1,
      };
    } else {
      return i;
    }
  });
};

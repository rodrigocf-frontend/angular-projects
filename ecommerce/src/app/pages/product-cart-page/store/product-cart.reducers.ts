import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../shared/models/product.model';
import { clearCart, setItemsInCart, toogleCart } from './product-cart.actions';
import { ProductColor, ProductSize } from '../../../shared/utils/product';

export const PRODUCT_CART_STORE_KEY = 'cart';

export type CartProductItem = {
  count: number;
  product: Product;
  color: ProductColor;
  size: ProductSize;
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
  on(setItemsInCart, (state, { product, count, color, size }) => {
    const cartItem = searchProductOnCart(state, product, color, size);

    if (!cartItem) {
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: product,
            count: 1,
            color,
            size,
          },
        ],
      };
    }
    return {
      ...state,
      items: [...updateCartItemCount(state, cartItem, count)],
    };
  }),
  on(clearCart, (state) => {
    return {
      ...state,
      items: [],
    };
  }),
);

const searchProductOnCart = (
  state: CartState,
  product: Product,
  color: ProductColor,
  size: ProductSize,
) =>
  state.items.find(
    (i) => i.product.id === product.id && i.color.hex === color.hex && i.size.label === size.label,
  );

const updateCartItemCount = (state: CartState, cartItem: CartProductItem, count?: number) => {
  if (count === 0) {
    return state.items.filter((i) => !isMatchCartItem(i, cartItem));
  }
  return state.items.map((i) => {
    if (isMatchCartItem(i, cartItem)) {
      return {
        ...i,
        count: count ? count : i.count + 1,
      };
    } else {
      return i;
    }
  });
};

export const isMatchCartItem = (cartItem: CartProductItem, comparaCartItem: CartProductItem) =>
  cartItem.product.id === comparaCartItem.product.id &&
  cartItem.color.hex === comparaCartItem.color.hex &&
  cartItem.size.label === comparaCartItem.size.label;

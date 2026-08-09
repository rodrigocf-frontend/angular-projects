import { cartReducers, CartState, isMatchCartItem } from './product-cart.reducers';
import { clearCart, setItemsInCart, toggleCart } from './product-cart.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';
import { ProductColor, ProductSize } from '../../../shared/utils/product';

const initialCartState: CartState = {
  items: [],
  open: false,
};

const black: ProductColor = { name: 'Black', hex: '#000' };
const blue: ProductColor = { name: 'Blue', hex: '#00f' };
const sizeM: ProductSize = { label: 'M', available: true };
const sizeL: ProductSize = { label: 'L', available: true };

describe('cartReducers', () => {
  it('should return the initial state for an unknown action', () => {
    const state = cartReducers(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialCartState);
  });

  it('toggleCart should flip the open flag', () => {
    let state = cartReducers(initialCartState, toggleCart());
    expect(state.open).toBe(true);
    state = cartReducers(state, toggleCart());
    expect(state.open).toBe(false);
  });

  describe('setItemsInCart', () => {
    it('should add a new item with count 1 when the cart is empty', () => {
      const state = cartReducers(
        initialCartState,
        setItemsInCart({ product: MOCK_PRODUCT, color: black, size: sizeM }),
      );
      expect(state.items).toEqual([{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }]);
    });

    it('should increment count when the same product/color/size already exists (no explicit count)', () => {
      const stateWithItem: CartState = {
        ...initialCartState,
        items: [{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }],
      };
      const state = cartReducers(
        stateWithItem,
        setItemsInCart({ product: MOCK_PRODUCT, color: black, size: sizeM }),
      );
      expect(state.items).toEqual([{ product: MOCK_PRODUCT, count: 2, color: black, size: sizeM }]);
    });

    it('should set an explicit count on an existing matching item', () => {
      const stateWithItem: CartState = {
        ...initialCartState,
        items: [{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }],
      };
      const state = cartReducers(
        stateWithItem,
        setItemsInCart({ product: MOCK_PRODUCT, count: 5, color: black, size: sizeM }),
      );
      expect(state.items).toEqual([{ product: MOCK_PRODUCT, count: 5, color: black, size: sizeM }]);
    });

    it('should NOT merge the same product in a different color', () => {
      const stateWithItem: CartState = {
        ...initialCartState,
        items: [{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }],
      };
      const state = cartReducers(
        stateWithItem,
        setItemsInCart({ product: MOCK_PRODUCT, color: blue, size: sizeM }),
      );
      expect(state.items).toHaveLength(2);
      expect(state.items).toEqual([
        { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM },
        { product: MOCK_PRODUCT, count: 1, color: blue, size: sizeM },
      ]);
    });

    it('should NOT merge the same product in a different size', () => {
      const stateWithItem: CartState = {
        ...initialCartState,
        items: [{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }],
      };
      const state = cartReducers(
        stateWithItem,
        setItemsInCart({ product: MOCK_PRODUCT, color: black, size: sizeL }),
      );
      expect(state.items).toHaveLength(2);
    });

    it('should NOT merge a different product with the same color/size', () => {
      const otherProduct = ALL_PRODUCTS_MOCK[0];
      const stateWithItem: CartState = {
        ...initialCartState,
        items: [{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }],
      };
      const state = cartReducers(
        stateWithItem,
        setItemsInCart({ product: otherProduct, color: black, size: sizeM }),
      );
      expect(state.items).toHaveLength(2);
    });

    it('should remove the line entirely when count is set to 0', () => {
      const stateWithItems: CartState = {
        ...initialCartState,
        items: [
          { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM },
          { product: MOCK_PRODUCT, count: 2, color: blue, size: sizeL },
        ],
      };
      const state = cartReducers(
        stateWithItems,
        setItemsInCart({ product: MOCK_PRODUCT, count: 0, color: black, size: sizeM }),
      );
      expect(state.items).toEqual([{ product: MOCK_PRODUCT, count: 2, color: blue, size: sizeL }]);
    });

    it('should leave other lines untouched when updating one line', () => {
      const otherProduct = ALL_PRODUCTS_MOCK[0];
      const stateWithItems: CartState = {
        ...initialCartState,
        items: [
          { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM },
          { product: otherProduct, count: 3, color: blue, size: sizeL },
        ],
      };
      const state = cartReducers(
        stateWithItems,
        setItemsInCart({ product: MOCK_PRODUCT, count: 9, color: black, size: sizeM }),
      );
      expect(state.items).toEqual([
        { product: MOCK_PRODUCT, count: 9, color: black, size: sizeM },
        { product: otherProduct, count: 3, color: blue, size: sizeL },
      ]);
    });
  });

  it('clearCart should empty the items array and keep other state', () => {
    const stateWithItems: CartState = {
      open: true,
      items: [{ product: MOCK_PRODUCT, count: 1, color: black, size: sizeM }],
    };
    const state = cartReducers(stateWithItems, clearCart());
    expect(state.items).toEqual([]);
    expect(state.open).toBe(true);
  });
});

describe('isMatchCartItem', () => {
  it('returns true when product id, color hex, and size label all match', () => {
    const a = { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM };
    const b = { product: MOCK_PRODUCT, count: 99, color: black, size: sizeM };
    expect(isMatchCartItem(a, b)).toBe(true);
  });

  it('returns false when color differs', () => {
    const a = { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM };
    const b = { product: MOCK_PRODUCT, count: 1, color: blue, size: sizeM };
    expect(isMatchCartItem(a, b)).toBe(false);
  });

  it('returns false when size differs', () => {
    const a = { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM };
    const b = { product: MOCK_PRODUCT, count: 1, color: black, size: sizeL };
    expect(isMatchCartItem(a, b)).toBe(false);
  });

  it('returns false when product id differs', () => {
    const otherProduct = ALL_PRODUCTS_MOCK[0];
    const a = { product: MOCK_PRODUCT, count: 1, color: black, size: sizeM };
    const b = { product: otherProduct, count: 1, color: black, size: sizeM };
    expect(isMatchCartItem(a, b)).toBe(false);
  });
});

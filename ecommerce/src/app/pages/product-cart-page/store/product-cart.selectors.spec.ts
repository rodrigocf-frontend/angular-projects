import {
  selectCartIsEmpty,
  selectCartItems,
  selectCartTotal,
  selectDrawerOpen,
  selectTotalItems,
} from './product-cart.selectors';
import { CartState, PRODUCT_CART_STORE_KEY } from './product-cart.reducers';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';
import { ProductColor, ProductSize } from '../../../shared/utils/product';

const color: ProductColor = { name: 'Black', hex: '#000' };
const size: ProductSize = { label: 'M', available: true };

const buildState = (cart: CartState) => ({ [PRODUCT_CART_STORE_KEY]: cart });

describe('product-cart selectors', () => {
  it('selectCartItems should return the items array', () => {
    const items = [{ product: MOCK_PRODUCT, count: 1, color, size }];
    const state = buildState({ items, open: false });
    expect(selectCartItems(state)).toEqual(items);
  });

  it('selectDrawerOpen should return the open flag', () => {
    expect(selectDrawerOpen(buildState({ items: [], open: true }))).toBe(true);
    expect(selectDrawerOpen(buildState({ items: [], open: false }))).toBe(false);
  });

  it('selectTotalItems should return the number of cart lines', () => {
    const items = [
      { product: MOCK_PRODUCT, count: 1, color, size },
      { product: ALL_PRODUCTS_MOCK[0], count: 5, color, size },
    ];
    expect(selectTotalItems(buildState({ items, open: false }))).toBe(2);
  });

  it('selectTotalItems should return 0 for an empty cart', () => {
    expect(selectTotalItems(buildState({ items: [], open: false }))).toBe(0);
  });

  describe('selectCartTotal', () => {
    it('should sum price * count across all items', () => {
      const items = [
        { product: MOCK_PRODUCT, count: 2, color, size },
        { product: ALL_PRODUCTS_MOCK[0], count: 3, color, size },
      ];
      const expected = MOCK_PRODUCT.price * 2 + ALL_PRODUCTS_MOCK[0].price * 3;
      expect(selectCartTotal(buildState({ items, open: false }))).toBeCloseTo(expected);
    });

    it('should return 0 for an empty cart', () => {
      expect(selectCartTotal(buildState({ items: [], open: false }))).toBe(0);
    });
  });

  describe('selectCartIsEmpty', () => {
    it('should be true when there are no items', () => {
      expect(selectCartIsEmpty(buildState({ items: [], open: false }))).toBe(true);
    });

    it('should be false when there is at least one item', () => {
      const items = [{ product: MOCK_PRODUCT, count: 1, color, size }];
      expect(selectCartIsEmpty(buildState({ items, open: false }))).toBe(false);
    });
  });
});

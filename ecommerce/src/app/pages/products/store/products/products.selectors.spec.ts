import {
  selectAllProducts,
  selectCategoriesActive,
  selectCheckedFilters,
  selectCheckedPagination,
  selectCheckIsFetched,
  selectFilters,
  selectFiltersActives,
  selectHasError,
  selectIsFetched,
  selectIsLoading,
  selectPagination,
  selectProductsFiltereds,
} from './products.selectors';
import { AppState, ProductsState } from './products.reducers';
import { ALL_PRODUCTS_MOCK } from '../../../../../mocks/models/products.mock';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';

const buildState = (overrides: Partial<ProductsState> = {}): AppState => {
  const productsState: ProductsState = {
    list: [],
    filters: {
      categories: [],
      sizes: [],
      colors: [],
      fromPrice: [],
      toPrice: [],
      sort: [],
    },
    pagination: {
      first: 0,
      prev: 0,
      next: 0,
      last: 0,
      pages: 0,
      items: 0,
      current: 0,
    },
    isLoading: true,
    isFetched: false,
    hasError: false,
    ...overrides,
  };
  return { products: productsState };
};

describe('products selectors', () => {
  it('selectFilters should return state.products.filters', () => {
    const state = buildState();
    expect(selectFilters(state)).toBe(state.products.filters);
  });

  it('selectPagination should return state.products.pagination', () => {
    const state = buildState();
    expect(selectPagination(state)).toBe(state.products.pagination);
  });

  it('selectIsLoading should return state.products.isLoading', () => {
    const state = buildState({ isLoading: false });
    expect(selectIsLoading(state)).toBe(false);
  });

  it('selectIsFetched should return state.products.isFetched', () => {
    const state = buildState({ isFetched: true });
    expect(selectIsFetched(state)).toBe(true);
  });

  it('selectHasError should return state.products.hasError', () => {
    const state = buildState({ hasError: true });
    expect(selectHasError(state)).toBe(true);
  });

  it('selectCheckIsFetched should wrap isFetched into an object', () => {
    const state = buildState({ isFetched: true });
    expect(selectCheckIsFetched(state)).toEqual({ isFetched: true });
  });

  it('selectCheckedPagination should return the pagination object', () => {
    const state = buildState();
    expect(selectCheckedPagination(state)).toBe(state.products.pagination);
  });

  it('selectAllProducts should return the product list', () => {
    const state = buildState({ list: [MOCK_PRODUCT] });
    expect(selectAllProducts(state)).toEqual([MOCK_PRODUCT]);
  });

  describe('selectCheckedFilters', () => {
    it('should return only checked categories/colors/sizes plus prices/sort as-is', () => {
      const state = buildState({
        filters: {
          categories: [
            { name: 'A', slug: 'a', count: 1, img: '', checked: true },
            { name: 'B', slug: 'b', count: 1, img: '', checked: false },
          ],
          sizes: [
            { name: 'P', checked: true },
            { name: 'M', checked: false },
          ],
          colors: [
            { name: 'Black', hex: '#000', checked: true },
            { name: 'White', hex: '#fff', checked: false },
          ],
          fromPrice: [{ name: 'from', type: 'fromPrice', value: 100 }],
          toPrice: [{ name: 'to', type: 'toPrice', value: 500 }],
          sort: [{ name: 'Newest', type: 'newest' }],
        },
      });
      const result = selectCheckedFilters(state);
      expect(result.categories).toEqual([
        { name: 'A', slug: 'a', count: 1, img: '', checked: true },
      ]);
      expect(result.sizes).toEqual([{ name: 'P', checked: true }]);
      expect(result.colors).toEqual([{ name: 'Black', hex: '#000', checked: true }]);
      expect(result.fromPrice).toEqual([{ name: 'from', type: 'fromPrice', value: 100 }]);
      expect(result.toPrice).toEqual([{ name: 'to', type: 'toPrice', value: 500 }]);
      expect(result.sort).toEqual([{ name: 'Newest', type: 'newest' }]);
    });

    it('should return empty arrays when nothing is checked', () => {
      const state = buildState();
      const result = selectCheckedFilters(state);
      expect(result.categories).toEqual([]);
      expect(result.colors).toEqual([]);
      expect(result.sizes).toEqual([]);
    });
  });

  describe('selectFiltersActives / selectCategoriesActive (internal V1 selector)', () => {
    it('should flatten all active category/color/size/price filters', () => {
      const state = buildState({
        filters: {
          categories: [{ name: 'A', slug: 'a', count: 1, img: '', checked: true }],
          sizes: [{ name: 'P', checked: true }],
          colors: [{ name: 'Black', hex: '#000', checked: true }],
          fromPrice: [{ name: 'from', type: 'fromPrice', value: 100 }],
          toPrice: [{ name: 'to', type: 'toPrice', value: 500 }],
          sort: [],
        },
      });
      const result = selectFiltersActives(state);
      expect(result).toEqual([
        { name: 'A', slug: 'a', count: 1, img: '', checked: true },
        { name: 'Black', hex: '#000', checked: true },
        { name: 'P', checked: true },
        { name: 'from', type: 'fromPrice', value: 100 },
        { name: 'to', type: 'toPrice', value: 500 },
      ]);
    });

    it('selectCategoriesActive should return only checked categories', () => {
      const state = buildState({
        filters: {
          categories: [
            { name: 'A', slug: 'a', count: 1, img: '', checked: true },
            { name: 'B', slug: 'b', count: 1, img: '', checked: false },
          ],
          sizes: [],
          colors: [],
          fromPrice: [],
          toPrice: [],
          sort: [],
        },
      });
      expect(selectCategoriesActive(state)).toEqual([
        { name: 'A', slug: 'a', count: 1, img: '', checked: true },
      ]);
    });
  });

  describe('selectProductsFiltereds', () => {
    const dress = ALL_PRODUCTS_MOCK.find((p) => p.category === 'Vestidos')!;
    const blazer = ALL_PRODUCTS_MOCK.find((p) => p.category === 'Blazers')!;

    it('should return all products when no filters are active', () => {
      const state = buildState({ list: [dress, blazer] });
      expect(selectProductsFiltereds(state)).toEqual([dress, blazer]);
    });

    it('should filter by category slug', () => {
      const state = buildState({
        list: [dress, blazer],
        filters: {
          categories: [{ name: 'Vestidos', slug: 'Vestidos', count: 1, img: '', checked: true }],
          sizes: [],
          colors: [],
          fromPrice: [],
          toPrice: [],
          sort: [],
        },
      });
      expect(selectProductsFiltereds(state)).toEqual([dress]);
    });

    it('should filter by color hex present in the product colors string', () => {
      // dress and blazer mocks both include black as their first color - use the dress's
      // second color, which is unique to it, so the assertion isn't a false positive.
      const colorHex = dress.colors.split(',')[1].split(':')[1];
      const state = buildState({
        list: [dress, blazer],
        filters: {
          categories: [],
          sizes: [],
          colors: [{ name: 'x', hex: 'not-in-any-product', checked: true }],
          fromPrice: [],
          toPrice: [],
          sort: [],
        },
      });
      expect(selectProductsFiltereds(state)).toEqual([]);

      const matchingState = buildState({
        list: [dress, blazer],
        filters: {
          categories: [],
          sizes: [],
          colors: [{ name: 'x', hex: colorHex, checked: true }],
          fromPrice: [],
          toPrice: [],
          sort: [],
        },
      });
      expect(selectProductsFiltereds(matchingState)).toEqual([dress]);
    });

    it('should filter by size label present in the product sizes string', () => {
      const sizeLabel = dress.sizes.split(',')[0].split(':')[0];
      const state = buildState({
        list: [dress, blazer],
        filters: {
          categories: [],
          sizes: [{ name: sizeLabel, checked: true }],
          colors: [],
          fromPrice: [],
          toPrice: [],
          sort: [],
        },
      });
      // Both dress and blazer share SIZES_ALL in the mock, so both match this size.
      expect(selectProductsFiltereds(state)).toEqual([dress, blazer]);
    });

    it('should filter by fromPrice/toPrice range', () => {
      const state = buildState({
        list: [dress, blazer],
        filters: {
          categories: [],
          sizes: [],
          colors: [],
          fromPrice: [{ name: 'from', type: 'fromPrice', value: blazer.price }],
          toPrice: [{ name: 'to', type: 'toPrice', value: blazer.price }],
          sort: [],
        },
      });
      expect(selectProductsFiltereds(state)).toEqual([blazer]);
    });

    it('should ignore price filters when value is null', () => {
      const state = buildState({
        list: [dress, blazer],
        filters: {
          categories: [],
          sizes: [],
          colors: [],
          fromPrice: [{ name: 'from', type: 'fromPrice', value: null }],
          toPrice: [{ name: 'to', type: 'toPrice', value: null }],
          sort: [],
        },
      });
      expect(selectProductsFiltereds(state)).toEqual([dress, blazer]);
    });

    it('should return an empty array when the product list is empty', () => {
      const state = buildState({ list: [] });
      expect(selectProductsFiltereds(state)).toEqual([]);
    });
  });
});

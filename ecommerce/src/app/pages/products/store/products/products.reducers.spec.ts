import {
  changePage,
  clearFilter,
  FilterType,
  loadProducts,
  setError,
  setFetched,
  setFilter,
  setLoading,
  setPagination,
  setProducts,
  configFilters,
  configPagination,
  setSort,
} from './products.actions';
import {
  CategoryFilter,
  ColorFilter,
  isCategoryFilter,
  isColorFilter,
  isPriceFilter,
  isSizeFilter,
  PriceFilter,
  productsReducer,
  ProductsState,
  SizeFilter,
} from './products.reducers';
import { FiltersApiResponse } from '../../../../core/services/product/products.service';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';

const initialState: ProductsState = {
  list: [],
  filters: {
    categories: [],
    sizes: [],
    colors: [],
    toPrice: [],
    fromPrice: [],
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
};

describe('productsReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = productsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('setProducts should set the product list and clear hasError', () => {
    const stateWithError: ProductsState = { ...initialState, hasError: true };
    const state = productsReducer(stateWithError, setProducts({ products: [MOCK_PRODUCT] }));
    expect(state.list).toEqual([MOCK_PRODUCT]);
    expect(state.hasError).toBe(false);
  });

  describe('configFilters', () => {
    const filters: FiltersApiResponse = {
      categories: [{ name: 'Vestidos', slug: 'vestidos', count: 10, img: 'img.png' }],
      sizes: [{ name: 'P' }],
      colors: [{ name: 'Preto', hex: '#000', checked: false }],
    };

    it('should mark all categories unchecked when no categoriesFromQueryParams is provided', () => {
      const state = productsReducer(initialState, configFilters({ filters, products: [] }));
      expect(state.filters.categories).toEqual([
        { name: 'Vestidos', slug: 'vestidos', count: 10, img: 'img.png', checked: false },
      ]);
      expect(state.filters.sizes).toEqual([{ name: 'P', checked: false }]);
      expect(state.filters.colors).toEqual([{ name: 'Preto', hex: '#000', checked: false }]);
    });

    it('should check the matching category when categoriesFromQueryParams is provided', () => {
      const categoriesFromQueryParams: CategoryFilter[] = [
        { name: 'Vestidos', slug: 'vestidos', count: 10, img: 'img.png', checked: true },
      ];
      const state = productsReducer(
        initialState,
        configFilters({ filters, products: [], categoriesFromQueryParams }),
      );
      expect(state.filters.categories[0].checked).toBe(true);
    });

    it('should uncheck categories that do not match categoriesFromQueryParams', () => {
      const categoriesFromQueryParams: CategoryFilter[] = [
        { name: 'Blazers', slug: 'blazers', count: 1, img: 'x.png', checked: true },
      ];
      const state = productsReducer(
        initialState,
        configFilters({ filters, products: [], categoriesFromQueryParams }),
      );
      expect(state.filters.categories[0].checked).toBe(false);
    });
  });

  it('configPagination should set pagination and reset current to 1', () => {
    const pagination = { first: 0, prev: 0, next: 1, last: 4, pages: 4, items: 36 };
    const state = productsReducer(initialState, configPagination({ pagination }));
    expect(state.pagination).toEqual({ ...pagination, current: 1 });
  });

  it('setPagination should merge partial pagination into existing pagination', () => {
    const stateWithPagination: ProductsState = {
      ...initialState,
      pagination: { first: 0, prev: 0, next: 1, last: 4, pages: 4, items: 36, current: 1 },
    };
    const state = productsReducer(
      stateWithPagination,
      setPagination({ pagination: { current: 3 } }),
    );
    expect(state.pagination).toEqual({
      first: 0,
      prev: 0,
      next: 1,
      last: 4,
      pages: 4,
      items: 36,
      current: 3,
    });
  });

  describe('setFilter', () => {
    const color: ColorFilter = { name: 'Black', hex: '#000', checked: false };
    const stateWithColor: ProductsState = {
      ...initialState,
      filters: { ...initialState.filters, colors: [color] },
    };

    it('should toggle a color filter checked from false to true', () => {
      const state = productsReducer(
        stateWithColor,
        setFilter({ page: 1, filterType: FilterType.color, color }),
      );
      expect(state.filters.colors[0].checked).toBe(true);
    });

    it('should toggle a color filter checked from true to false', () => {
      const checkedState: ProductsState = {
        ...initialState,
        filters: { ...initialState.filters, colors: [{ ...color, checked: true }] },
      };
      const state = productsReducer(
        checkedState,
        setFilter({ page: 1, filterType: FilterType.color, color }),
      );
      expect(state.filters.colors[0].checked).toBe(false);
    });

    it('should toggle a category filter', () => {
      const category: CategoryFilter = {
        name: 'Vestidos',
        slug: 'vestidos',
        count: 1,
        img: 'x.png',
        checked: false,
      };
      const stateWithCategory: ProductsState = {
        ...initialState,
        filters: { ...initialState.filters, categories: [category] },
      };
      const state = productsReducer(
        stateWithCategory,
        setFilter({ page: 1, filterType: FilterType.category, category }),
      );
      expect(state.filters.categories[0].checked).toBe(true);
    });

    it('should toggle a size filter', () => {
      const size: SizeFilter = { name: 'M', checked: false };
      const stateWithSize: ProductsState = {
        ...initialState,
        filters: { ...initialState.filters, sizes: [size] },
      };
      const state = productsReducer(
        stateWithSize,
        setFilter({ page: 1, filterType: FilterType.size, size }),
      );
      expect(state.filters.sizes[0].checked).toBe(true);
    });

    it('should set fromPrice filter', () => {
      const price: PriceFilter = { name: 'from', type: 'fromPrice', value: 100 };
      const state = productsReducer(
        initialState,
        setFilter({ page: 1, filterType: FilterType.price, price }),
      );
      expect(state.filters.fromPrice).toEqual([price]);
    });

    it('should set toPrice filter', () => {
      const price: PriceFilter = { name: 'to', type: 'toPrice', value: 500 };
      const state = productsReducer(
        initialState,
        setFilter({ page: 1, filterType: FilterType.price, price }),
      );
      expect(state.filters.toPrice).toEqual([price]);
    });

    it('should return unchanged state when price filter type is neither fromPrice nor toPrice', () => {
      const state = productsReducer(
        initialState,
        setFilter({ page: 1, filterType: FilterType.price, price: undefined }),
      );
      expect(state).toBe(initialState);
    });

    it('should return unchanged state for an unknown filterType', () => {
      const state = productsReducer(
        initialState,
        setFilter({ page: 1, filterType: 99 as FilterType }),
      );
      expect(state).toBe(initialState);
    });
  });

  it('changePage should update pagination.current', () => {
    const state = productsReducer(initialState, changePage({ page: 5 }));
    expect(state.pagination.current).toBe(5);
  });

  it('clearFilter should reset state back to initialState', () => {
    const dirtyState: ProductsState = {
      ...initialState,
      list: [MOCK_PRODUCT],
      isLoading: false,
      hasError: true,
    };
    const state = productsReducer(dirtyState, clearFilter({ page: 1 }));
    expect(state).toEqual(initialState);
  });

  describe('loadProducts', () => {
    it('should return the same state when sort is undefined', () => {
      const state = productsReducer(initialState, loadProducts({ page: 1 }));
      expect(state).toBe(initialState);
    });

    it('should return the same state when sort is an empty array', () => {
      const state = productsReducer(initialState, loadProducts({ page: 1, sort: [] }));
      expect(state).toBe(initialState);
    });

    it('should set filters.sort when sort has items', () => {
      const sort = [{ name: 'Newest', type: 'newest' as const }];
      const state = productsReducer(initialState, loadProducts({ page: 1, sort }));
      expect(state.filters.sort).toEqual(sort);
    });
  });

  it('setSort should replace filters.sort with a single-item array', () => {
    const sort = { name: 'Featured', type: 'featured' as const };
    const state = productsReducer(initialState, setSort({ sort }));
    expect(state.filters.sort).toEqual([sort]);
  });

  it('setLoading should set isLoading', () => {
    const state = productsReducer(initialState, setLoading({ isLoading: false }));
    expect(state.isLoading).toBe(false);
  });

  it('setFetched should set isFetched to true', () => {
    const state = productsReducer(initialState, setFetched());
    expect(state.isFetched).toBe(true);
  });

  it('setError should set hasError', () => {
    const state = productsReducer(initialState, setError({ hasError: true }));
    expect(state.hasError).toBe(true);
  });
});

describe('type guards', () => {
  it('isColorFilter should detect objects with hex', () => {
    expect(isColorFilter({ hex: '#000' })).toBe(true);
    expect(isColorFilter({ count: 1 })).toBe(false);
    expect(isColorFilter(null)).toBe(false);
    expect(isColorFilter('string')).toBe(false);
  });

  it('isCategoryFilter should detect objects with count', () => {
    expect(isCategoryFilter({ count: 1 })).toBe(true);
    expect(isCategoryFilter({ hex: '#000' })).toBe(false);
    expect(isCategoryFilter(null)).toBe(false);
  });

  it('isSizeFilter should detect objects without hex and without count', () => {
    expect(isSizeFilter({ name: 'M' })).toBe(true);
    expect(isSizeFilter({ hex: '#000' })).toBe(false);
    expect(isSizeFilter({ count: 1 })).toBe(false);
    expect(isSizeFilter(null)).toBe(false);
  });

  it('isPriceFilter should detect objects with value', () => {
    expect(isPriceFilter({ value: 10 })).toBe(true);
    expect(isPriceFilter({ value: null })).toBe(true);
    expect(isPriceFilter({ hex: '#000' })).toBe(false);
    expect(isPriceFilter(null)).toBe(false);
  });
});

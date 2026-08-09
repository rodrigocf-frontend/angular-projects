import {
  changePage,
  clearFilter,
  configFilters,
  configPagination,
  FilterType,
  loadProducts,
  setError,
  setFetched,
  setFilter,
  setLoading,
  setPagination,
  setProducts,
  setSort,
} from './products.actions';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';
import { FiltersApiResponse } from '../../../../core/services/product/products.service';

describe('Products actions', () => {
  it('loadProducts should create an action with page/sort/categories', () => {
    const action = loadProducts({ page: 2, sort: [{ name: 's', type: 'newest' }], categories: [] });
    expect(action.type).toBe('[Page Products] - Load Products');
    expect(action.page).toBe(2);
    expect(action.sort).toEqual([{ name: 's', type: 'newest' }]);
    expect(action.categories).toEqual([]);
  });

  it('loadProducts should create an action without optional props', () => {
    const action = loadProducts({ page: 1 });
    expect(action.type).toBe('[Page Products] - Load Products');
    expect(action.sort).toBeUndefined();
    expect(action.categories).toBeUndefined();
  });

  it('setProducts should create an action with products and optional items', () => {
    const action = setProducts({ products: [MOCK_PRODUCT], items: 5 });
    expect(action.type).toBe('[Page Products] - Set Products');
    expect(action.products).toEqual([MOCK_PRODUCT]);
    expect(action.items).toBe(5);
  });

  it('configFilters should create an action with filters/products/categoriesFromQueryParams', () => {
    const filters: FiltersApiResponse = { categories: [], sizes: [], colors: [] };
    const action = configFilters({
      filters,
      products: [MOCK_PRODUCT],
      categoriesFromQueryParams: [],
    });
    expect(action.type).toBe('[Page Products] - Configuration Filters');
    expect(action.filters).toBe(filters);
    expect(action.products).toEqual([MOCK_PRODUCT]);
    expect(action.categoriesFromQueryParams).toEqual([]);
  });

  it('configPagination should create an action with pagination', () => {
    const pagination = { first: 0, prev: 0, next: 1, last: 3, pages: 3, items: 27 };
    const action = configPagination({ pagination });
    expect(action.type).toBe('[Page Products] - Configuration Pagination');
    expect(action.pagination).toBe(pagination);
  });

  it('setPagination should create an action with partial pagination', () => {
    const action = setPagination({ pagination: { current: 2 } });
    expect(action.type).toBe('[Page Products] - Set Pagination');
    expect(action.pagination).toEqual({ current: 2 });
  });

  it('changePage should create an action with page', () => {
    const action = changePage({ page: 4 });
    expect(action.type).toBe('[Products Page] - Change Page');
    expect(action.page).toBe(4);
  });

  it('clearFilter should create an action with page/sort/categories', () => {
    const action = clearFilter({ page: 1 });
    expect(action.type).toBe('[Products Page] - Clear Filters');
    expect(action.page).toBe(1);
  });

  it('setSort should create an action with sort', () => {
    const sort = { name: 'Newest', type: 'newest' as const };
    const action = setSort({ sort });
    expect(action.type).toBe('[Products Page] - Set List Order');
    expect(action.sort).toBe(sort);
  });

  it('setLoading should create an action with isLoading', () => {
    const action = setLoading({ isLoading: true });
    expect(action.type).toBe('[Products Page] - Set Loading');
    expect(action.isLoading).toBe(true);
  });

  it('setFilter should create an action with filterType and optional filter payloads', () => {
    const color = { name: 'Black', hex: '#000', checked: false };
    const action = setFilter({ page: 1, filterType: FilterType.color, color });
    expect(action.type).toBe('[Products Page] - Add/Remove Filter');
    expect(action.filterType).toBe(FilterType.color);
    expect(action.color).toBe(color);
    expect(action.category).toBeUndefined();
    expect(action.size).toBeUndefined();
    expect(action.price).toBeUndefined();
  });

  it('FilterType enum should have expected members', () => {
    expect(FilterType.category).toBe(0);
    expect(FilterType.size).toBe(1);
    expect(FilterType.color).toBe(2);
    expect(FilterType.price).toBe(3);
  });

  it('setFetched should create an action with no payload', () => {
    const action = setFetched();
    expect(action.type).toBe('[Products Page] - set Fetched');
  });

  it('setError should create an action with hasError', () => {
    const action = setError({ hasError: true });
    expect(action.type).toBe('[Products Page] - Set Error');
    expect(action.hasError).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, throwError, of } from 'rxjs';
import { vi } from 'vitest';
import { ProductsPageEffects } from './products.effects';
import { ProductService } from '../../../../core/services/product/products.service';
import {
  changePage,
  clearFilter,
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
  FilterType,
} from './products.actions';
import { MOCK_PRODUCT } from '../../../../../mocks/models/product.mock';
import { AppState } from './products.reducers';

describe('ProductsPageEffects', () => {
  let effects: ProductsPageEffects;
  let actions$: Subject<Action>;
  let store: MockStore;
  let productService: {
    getProducts: ReturnType<typeof vi.fn>;
    getFilters: ReturnType<typeof vi.fn>;
  };

  const initialState: AppState = {
    products: {
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
        current: 1,
      },
      isLoading: true,
      isFetched: false,
      hasError: false,
    },
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    productService = {
      getProducts: vi.fn(),
      getFilters: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsPageEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        { provide: ProductService, useValue: productService },
      ],
    });

    effects = TestBed.inject(ProductsPageEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadProducts$', () => {
    const productsResponse = {
      data: [MOCK_PRODUCT],
      first: 0,
      prev: 0,
      next: 1,
      last: 2,
      pages: 2,
      items: 18,
    };
    const filtersResponse = { categories: [], sizes: [], colors: [] };

    it('emits setProducts, configFilters, configPagination, setLoading(false) and setFetched on success', () => {
      productService.getProducts.mockReturnValue(of(productsResponse));
      productService.getFilters.mockReturnValue(of(filtersResponse));

      const emitted: Action[] = [];
      const sub = effects.loadProducts$.subscribe((action) => emitted.push(action));

      actions$.next(loadProducts({ page: 1 }));

      expect(emitted).toEqual([
        setProducts({ products: [MOCK_PRODUCT] }),
        configFilters({
          products: [MOCK_PRODUCT],
          filters: filtersResponse,
          categoriesFromQueryParams: undefined,
        }),
        configPagination({
          pagination: { first: 0, prev: 0, next: 1, last: 2, pages: 2, items: 18 },
        }),
        setLoading({ isLoading: false }),
        setFetched(),
      ]);
      sub.unsubscribe();
    });

    it('also reacts to clearFilter actions', () => {
      productService.getProducts.mockReturnValue(of(productsResponse));
      productService.getFilters.mockReturnValue(of(filtersResponse));

      const emitted: Action[] = [];
      const sub = effects.loadProducts$.subscribe((action) => emitted.push(action));

      actions$.next(clearFilter({ page: 1 }));

      expect(emitted.length).toBe(5);
      expect(emitted[0]).toEqual(setProducts({ products: [MOCK_PRODUCT] }));
      sub.unsubscribe();
    });

    it('emits setLoading(false) and setError(true) on failure, and keeps working afterwards', () => {
      productService.getFilters.mockReturnValue(of(filtersResponse));
      productService.getProducts.mockReturnValueOnce(throwError(() => new Error('boom')));

      const emitted: Action[] = [];
      const sub = effects.loadProducts$.subscribe((action) => emitted.push(action));

      actions$.next(loadProducts({ page: 1 }));

      expect(emitted).toEqual([setLoading({ isLoading: false }), setError({ hasError: true })]);

      // The outer effect stream must still be alive after an error.
      productService.getProducts.mockReturnValueOnce(of(productsResponse));
      actions$.next(loadProducts({ page: 2 }));

      expect(emitted.length).toBe(7);
      expect(emitted[2]).toEqual(setProducts({ products: [MOCK_PRODUCT] }));
      sub.unsubscribe();
    });
  });

  describe('loadFilter$', () => {
    const productsResponse = {
      data: [MOCK_PRODUCT],
      first: 0,
      prev: 0,
      next: 1,
      last: 2,
      pages: 2,
      items: 18,
    };

    it('uses page = 1 for non changePage actions and emits setProducts/setPagination/setLoading(false)', () => {
      productService.getProducts.mockReturnValue(of(productsResponse));

      const emitted: Action[] = [];
      const sub = effects.loadFilter$.subscribe((action) => emitted.push(action));

      actions$.next(setSort({ sort: { name: 'Newest', type: 'newest' } }));

      expect(productService.getProducts).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
      expect(emitted).toEqual([
        setProducts({ products: [MOCK_PRODUCT] }),
        setPagination({
          pagination: { first: 0, prev: 0, next: 1, last: 2, pages: 2, items: 18, current: 1 },
        }),
        setLoading({ isLoading: false }),
      ]);
      sub.unsubscribe();
    });

    it('uses the action page for changePage actions', () => {
      productService.getProducts.mockReturnValue(of(productsResponse));

      const emitted: Action[] = [];
      const sub = effects.loadFilter$.subscribe((action) => emitted.push(action));

      actions$.next(changePage({ page: 3 }));

      expect(productService.getProducts).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
      expect(emitted[1]).toEqual(
        setPagination({
          pagination: { first: 0, prev: 0, next: 1, last: 2, pages: 2, items: 18, current: 3 },
        }),
      );
      sub.unsubscribe();
    });

    it('reacts to setFilter actions', () => {
      productService.getProducts.mockReturnValue(of(productsResponse));

      const emitted: Action[] = [];
      const sub = effects.loadFilter$.subscribe((action) => emitted.push(action));

      actions$.next(
        setFilter({
          page: 1,
          filterType: FilterType.color,
          color: { name: 'x', hex: '#000', checked: false },
        }),
      );

      expect(emitted.length).toBe(3);
      sub.unsubscribe();
    });

    it('emits setLoading(false) and setError(true) on failure, and keeps working afterwards', () => {
      productService.getProducts.mockReturnValueOnce(throwError(() => new Error('boom')));

      const emitted: Action[] = [];
      const sub = effects.loadFilter$.subscribe((action) => emitted.push(action));

      actions$.next(setSort({ sort: { name: 'Newest', type: 'newest' } }));

      expect(emitted).toEqual([setLoading({ isLoading: false }), setError({ hasError: true })]);

      productService.getProducts.mockReturnValueOnce(of(productsResponse));
      actions$.next(setSort({ sort: { name: 'Featured', type: 'featured' } }));

      expect(emitted.length).toBe(5);
      expect(emitted[2]).toEqual(setProducts({ products: [MOCK_PRODUCT] }));
      sub.unsubscribe();
    });
  });

  describe('isLoadingFilter$', () => {
    it('emits setLoading(true) for setFilter, changePage and setSort actions', () => {
      const emitted: Action[] = [];
      const sub = effects.isLoadingFilter$.subscribe((action) => emitted.push(action));

      actions$.next(changePage({ page: 2 }));
      actions$.next(setSort({ sort: { name: 'Newest', type: 'newest' } }));
      actions$.next(setFilter({ page: 1, filterType: FilterType.category, category: undefined }));

      expect(emitted).toEqual([
        setLoading({ isLoading: true }),
        setLoading({ isLoading: true }),
        setLoading({ isLoading: true }),
      ]);
      sub.unsubscribe();
    });

    it('does not emit for unrelated actions', () => {
      const emitted: Action[] = [];
      const sub = effects.isLoadingFilter$.subscribe((action) => emitted.push(action));

      actions$.next(loadProducts({ page: 1 }));

      expect(emitted).toEqual([]);
      sub.unsubscribe();
    });
  });
});

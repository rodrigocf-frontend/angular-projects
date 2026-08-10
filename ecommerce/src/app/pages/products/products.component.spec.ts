import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, Subject } from 'rxjs';

import ProductsComponent from './products.component';
import {
  selectCheckedPagination,
  selectFiltersActives,
  selectProductsFiltereds,
} from './store/products/products.selectors';
import { FilterType, loadProducts, setFilter, setSort } from './store/products/products.actions';
import {
  CategoryFilter,
  Filters,
  FiltersPagination,
  ProductsState,
  SizeFilter,
} from './store/products/products.reducers';
import { ALL_PRODUCTS_MOCK } from '../../../mocks/models/products.mock';

const buildPagination = (overrides: Partial<FiltersPagination> = {}): FiltersPagination => ({
  first: 1,
  prev: 1,
  next: 2,
  last: 1,
  pages: 1,
  items: 0,
  current: 1,
  ...overrides,
});

const emptyFilters: Filters = {
  categories: [],
  sizes: [],
  colors: [],
  toPrice: [],
  fromPrice: [],
  sort: [],
};

const initialProductsState: ProductsState = {
  list: [],
  filters: emptyFilters,
  pagination: buildPagination(),
  isLoading: false,
  isFetched: false,
  hasError: false,
};

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let store: MockStore;

  const activatedRouteMock = {
    snapshot: { queryParams: {} as Record<string, string> },
    queryParams: of({}) as Observable<Record<string, string>>,
  };

  // `selectIsLoading`, `selectHasError` and `selectFilters` are plain state-access functions
  // (not built via `createSelector`), so MockStore.overrideSelector can't target them directly
  // (it throws internally on non-memoized selectors). They're driven through the mock store's
  // initialState instead; only the createSelector-based ones below use overrideSelector.
  const configureModule = async (
    overrides: {
      productsState?: Partial<ProductsState>;
      queryParams?: Record<string, string>;
      queryParams$?: Observable<Record<string, string>>;
    } = {},
  ) => {
    activatedRouteMock.snapshot.queryParams = overrides.queryParams ?? {};
    activatedRouteMock.queryParams = overrides.queryParams$ ?? of(overrides.queryParams ?? {});

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: { products: { ...initialProductsState, ...overrides.productsState } },
        }),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectProductsFiltereds, []);
    store.overrideSelector(selectCheckedPagination, buildPagination());
    store.overrideSelector(selectFiltersActives, []);
  };

  const createComponent = async () => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create and dispatch loadProducts on init', async () => {
    await configureModule();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    await createComponent();

    expect(component).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(loadProducts({ page: 1, categories: [], sort: [] }));
  });

  it('should build categories/sort from route query params when loading initial products', async () => {
    await configureModule({ queryParams: { category: 'vestidos' } });
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    await createComponent();

    expect(dispatchSpy).toHaveBeenCalledWith(
      loadProducts({
        page: 1,
        categories: [{ checked: true, count: 0, img: '', name: '', slug: 'vestidos' }],
        sort: [],
      }),
    );
  });

  it('should render the loading list when isLoading$ is true', async () => {
    await configureModule({ productsState: { isLoading: true } });
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-loading-list')).toBeTruthy();
    expect(compiled.querySelector('app-list-error')).toBeFalsy();
    expect(compiled.querySelector('app-products-list')).toBeFalsy();
  });

  it('should render app-list-error when hasError$ is true', async () => {
    await configureModule({ productsState: { isLoading: false, hasError: true } });
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-list-error')).toBeTruthy();
    expect(compiled.querySelector('app-loading-list')).toBeFalsy();
    expect(compiled.querySelector('app-products-list')).toBeFalsy();
  });

  it('should call loadInitialProducts again when app-list-error emits retry', async () => {
    await configureModule({ productsState: { isLoading: false, hasError: true } });
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const compiled = fixture.nativeElement as HTMLElement;
    const retryButton = compiled.querySelector<HTMLButtonElement>('app-list-error .error-btn');
    retryButton?.click();
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(loadProducts({ page: 1, categories: [], sort: [] }));
  });

  it('should render the products list without pagination when there are no products', async () => {
    await configureModule();
    store.overrideSelector(selectProductsFiltereds, []);
    store.overrideSelector(selectCheckedPagination, buildPagination({ items: 0 }));
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-products-list')).toBeTruthy();
    expect(compiled.querySelector('app-pagination')).toBeFalsy();
  });

  it('should render the products list with pagination when there are products', async () => {
    await configureModule();
    store.overrideSelector(selectProductsFiltereds, ALL_PRODUCTS_MOCK.slice(0, 3));
    store.overrideSelector(selectCheckedPagination, buildPagination({ items: 3, pages: 2 }));
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-products-list')).toBeTruthy();
    expect(compiled.querySelector('app-pagination')).toBeTruthy();
    expect(compiled.querySelector('.results-count')?.textContent).toContain('3 peças');
  });

  it('should render the sort select with the current sort type selected', async () => {
    await configureModule({
      productsState: {
        filters: { ...emptyFilters, sort: [{ name: 'Novidades', type: 'newest' }] },
      },
    });
    await createComponent();

    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector<HTMLSelectElement>('.sort-select');
    expect(select).toBeTruthy();
    const selectedOption = Array.from(select?.options ?? []).find((opt) => opt.selected);
    expect(selectedOption?.value).toBe('newest');
  });

  it('onSelectOrder should dispatch setSort for a known type', async () => {
    await configureModule();
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.onSelectOrder('max-price');

    expect(dispatchSpy).toHaveBeenCalledWith(
      setSort({ sort: { name: 'Maior Preço', type: 'max-price' } }),
    );
  });

  it('onSelectOrder should not dispatch for an unknown type', async () => {
    await configureModule();
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.onSelectOrder('unknown-type');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('dispatching setSort via the select change event should call onSelectOrder', async () => {
    await configureModule({
      productsState: {
        filters: { ...emptyFilters, sort: [{ name: 'Relevância', type: 'relevance' }] },
      },
    });
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector<HTMLSelectElement>('.sort-select')!;
    select.value = 'min-price';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(
      setSort({ sort: { name: 'Menor Preço', type: 'min-price' } }),
    );
  });

  it('handleFilter should dispatch setFilter for a category filter', async () => {
    await configureModule();
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const category: CategoryFilter = {
      name: 'Vestidos',
      checked: true,
      count: 5,
      img: '',
      slug: 'vestidos',
    };

    component.handleFilter(category);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.category, category }),
    );
  });

  it('handleFilter should dispatch setFilter for a size filter', async () => {
    await configureModule();
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const size: SizeFilter = { name: 'P', checked: true };

    component.handleFilter(size);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.size, size }),
    );
  });

  it('handleFilter should dispatch setFilter for a color filter', async () => {
    await configureModule();
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const color = { name: 'Preto', checked: true, hex: '#111111' };

    component.handleFilter(color);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.color, color }),
    );
  });

  it('should render active filter chips and remove one when its × is clicked', async () => {
    const category: CategoryFilter = {
      name: 'Vestidos',
      checked: true,
      count: 5,
      img: '',
      slug: 'vestidos',
    };
    await configureModule();
    store.overrideSelector(selectFiltersActives, [category]);
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const compiled = fixture.nativeElement as HTMLElement;
    const chip = compiled.querySelector('.active-filter');
    expect(chip?.textContent).toContain('Vestidos');
    const removeButton = chip?.querySelector('button') as HTMLButtonElement;
    removeButton.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.category, category }),
    );
  });

  it('should call the real sidebar.clearFilter() (via #sidebar template ref) when "Limpar tudo" is clicked', async () => {
    const category: CategoryFilter = {
      name: 'Vestidos',
      checked: true,
      count: 5,
      img: '',
      slug: 'vestidos',
    };
    await configureModule();
    store.overrideSelector(selectFiltersActives, [category]);
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const compiled = fixture.nativeElement as HTMLElement;
    const clearAllButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Limpar tudo'),
    ) as HTMLButtonElement;
    expect(clearAllButton).toBeTruthy();
    clearAllButton.click();
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: '[Products Page] - Clear Filters', page: 1 }),
    );
  });

  it('every top-level orderSelects entry should be selectable via onSelectOrder', async () => {
    await configureModule();
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    for (const item of component.orderSelects) {
      dispatchSpy.mockClear();
      component.onSelectOrder(item.type);
      expect(dispatchSpy).toHaveBeenCalledWith(setSort({ sort: item }));
    }
  });

  it('should label fromPrice/toPrice active filters as "Min."/"Máx." respectively', async () => {
    await configureModule();
    store.overrideSelector(selectFiltersActives, [
      { type: 'fromPrice', name: '', value: 100 } as any,
      { type: 'toPrice', name: '', value: 500 } as any,
    ]);
    await createComponent();

    let result: any[] = [];
    component.filtersActives$.subscribe((v) => (result = v));

    expect(result[0].name).toBe('Min. R$100');
    expect(result[1].name).toBe('Máx. R$ 500');
  });

  it('updateQueryParams should set priceMin/priceMax from the active price filter arrays', async () => {
    await configureModule();
    await createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (component as any).updateQueryParams({
      categories: [],
      sizes: [],
      colors: [],
      fromPrice: [{ type: 'fromPrice', name: '', value: 100 }],
      toPrice: [{ type: 'toPrice', name: '', value: 500 }],
      sort: [],
    });

    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { priceMin: 100, priceMax: 500 } }),
    );
  });

  it('updateQueryParams should omit priceMin/priceMax when there is no active price filter', async () => {
    await configureModule();
    await createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (component as any).updateQueryParams({
      categories: [],
      sizes: [],
      colors: [],
      fromPrice: [],
      toPrice: [],
      sort: [],
    });

    expect(navigateSpy).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: {} }));
  });

  it('updateQueryParams should write new/sale back from the active sort filter', async () => {
    await configureModule();
    await createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (component as any).updateQueryParams({
      categories: [],
      sizes: [],
      colors: [],
      fromPrice: [],
      toPrice: [],
      sort: [{ name: 'Novidades', type: 'newest' }],
    });

    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { new: 'true' } }),
    );
  });

  it('updateQueryParams should write the category slug (not name) back to the URL', async () => {
    await configureModule();
    await createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (component as any).updateQueryParams({
      categories: [{ name: 'Vestidos', slug: 'vestidos', checked: true, count: 1, img: '' }],
      sizes: [],
      colors: [],
      fromPrice: [],
      toPrice: [],
      sort: [],
    });

    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { category: 'vestidos' } }),
    );
  });

  it('does not re-dispatch loadProducts for a URL change caused by its own state-to-URL sync, but does for an external one', async () => {
    const queryParams$ = new Subject<Record<string, string>>();
    await configureModule({ queryParams$ });
    await createComponent();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    dispatchSpy.mockClear();

    // updateQueryParams() (state -> URL) sets the guard flag right before navigating; the
    // resulting queryParams emission it causes must not trigger another loadProducts, or the
    // subsequent configFilters() would rebuild the filter list from the (URL-only) params and
    // wipe out size/color/price selections that never round-trip through the URL.
    (component as any).updateQueryParams({
      categories: [],
      sizes: [{ name: 'M' }],
      colors: [],
      fromPrice: [],
      toPrice: [],
      sort: [],
    });
    queryParams$.next({ size: 'M' });
    await fixture.whenStable();

    expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: loadProducts.type }));

    // A real external navigation (e.g. a navbar link) must still trigger a reload.
    queryParams$.next({ new: 'true' });
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: loadProducts.type }));
  });
});

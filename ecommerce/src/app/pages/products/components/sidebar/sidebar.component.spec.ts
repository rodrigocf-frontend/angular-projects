// Neither vi.mock on a relative import nor vi.spyOn on a namespace import is supported by the
// Angular Vitest integration, so the 'lenis' package itself (a bare specifier) is mocked instead,
// letting the real scrollBehaviorTo run and asserting on the underlying Lenis.scrollTo call.
const scrollToMock = vi.fn();

vi.mock('lenis', () => ({
  default: vi.fn(function (this: any) {
    this.scrollTo = scrollToMock;
    this.raf = vi.fn();
    this.destroy = vi.fn();
  }),
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SidebarComponent } from './sidebar.component';
import { clearFilter, FilterType, setFilter } from '../../store/products/products.actions';
import { CategoryFilter, ColorFilter, SizeFilter } from '../../store/products/products.reducers';

const CATEGORY: CategoryFilter = {
  name: 'Vestidos',
  checked: false,
  count: 12,
  img: '',
  slug: 'vestidos',
};
const CATEGORY_CHECKED: CategoryFilter = {
  ...CATEGORY,
  name: 'Blazers',
  checked: true,
  slug: 'blazers',
};
const SIZE: SizeFilter = { name: 'P', checked: false };
const COLOR: ColorFilter = { name: 'Preto', checked: false, hex: '#111111' };

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let store: MockStore;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="products-list"></div>';

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        // selectFilters is a plain state-access function (not built via createSelector), so
        // MockStore.overrideSelector/selectors can't target it directly (it throws internally
        // on non-memoized selectors) - drive it through initialState instead.
        provideMockStore({
          initialState: {
            products: {
              filters: {
                categories: [CATEGORY, CATEGORY_CHECKED],
                sizes: [SIZE],
                colors: [COLOR],
                fromPrice: [],
                toPrice: [],
                sort: [],
              },
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    vi.clearAllMocks();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render filter options from the store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.filter-option').length).toBe(2);
    expect(compiled.querySelectorAll('.size-option').length).toBe(1);
    expect(compiled.querySelectorAll('.color-option').length).toBe(1);
  });

  it('should mark checked category as selected via the checked class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const options = Array.from(compiled.querySelectorAll('.filter-option'));
    const checkedOption = options.find((el) => el.textContent?.includes('Blazers'));
    expect(checkedOption?.querySelector('.filter-checkbox')?.classList.contains('checked')).toBe(
      true,
    );
  });

  it('should dispatch setFilter with category filter type when a category option is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const options = Array.from(compiled.querySelectorAll<HTMLElement>('.filter-option'));
    const categoryOption = options.find((el) => el.textContent?.includes('Vestidos'));
    categoryOption?.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.category, category: CATEGORY }),
    );
    expect(scrollToMock).toHaveBeenCalledWith(
      document.querySelector('#products-list'),
      expect.anything(),
    );
  });

  it('should dispatch setFilter with size filter type when a size option is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const sizeOption = compiled.querySelector<HTMLElement>('.size-option');
    sizeOption?.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.size, size: SIZE }),
    );
  });

  it('should dispatch setFilter with color filter type when a color option is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const colorOption = compiled.querySelector<HTMLElement>('.color-option');
    colorOption?.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({ page: 1, filterType: FilterType.color, color: COLOR }),
    );
  });

  it('should dispatch clearFilter, reset price controls and scroll when "Limpar filtros" is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.fromPrice.setValue('100');
    component.toPrice.setValue('200');

    const compiled = fixture.nativeElement as HTMLElement;
    const clearButton = Array.from(compiled.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Limpar filtros'),
    ) as HTMLButtonElement;
    clearButton.click();

    expect(dispatchSpy).toHaveBeenCalledWith(clearFilter({ page: 1 }));
    expect(component.fromPrice.value).toBeNull();
    expect(component.toPrice.value).toBeNull();
    expect(scrollToMock).toHaveBeenCalledWith(
      document.querySelector('#products-list'),
      expect.anything(),
    );
  });

  it('clearFilter() should be callable directly (used via #sidebar template ref in ProductsComponent)', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.clearFilter();
    expect(dispatchSpy).toHaveBeenCalledWith(clearFilter({ page: 1 }));
  });

  it('should dispatch a fromPrice filter after the input debounces', async () => {
    vi.useFakeTimers();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.fromPrice.setValue('R$ 3,00');
    await vi.advanceTimersByTimeAsync(700);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({
        page: 1,
        filterType: FilterType.price,
        price: { type: 'fromPrice', name: '', value: 3 },
      }),
    );
    vi.useRealTimers();
  });

  it('should dispatch a toPrice filter after the input debounces', async () => {
    vi.useFakeTimers();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.toPrice.setValue('R$ 5,00');
    await vi.advanceTimersByTimeAsync(700);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setFilter({
        page: 1,
        filterType: FilterType.price,
        price: { type: 'toPrice', name: '', value: 5 },
      }),
    );
    vi.useRealTimers();
  });
});

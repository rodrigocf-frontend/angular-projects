// Neither vi.mock on a relative import nor vi.spyOn on a namespace import is supported by the
// Angular Vitest integration, so the 'lenis' package itself (a bare specifier) is mocked instead,
// letting the real scrollToTop run and asserting on the underlying Lenis.scrollTo call.
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

import { PaginationComponent } from './pagination.component';
import { FiltersPagination } from '../../store/products/products.reducers';
import { changePage } from '../../store/products/products.actions';

const buildPagination = (overrides: Partial<FiltersPagination> = {}): FiltersPagination => ({
  first: 1,
  prev: 1,
  next: 2,
  last: 10,
  pages: 10,
  items: 100,
  current: 1,
  ...overrides,
});

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    scrollToMock.mockClear();
  });

  const setPagination = async (pagination: FiltersPagination) => {
    fixture.componentRef.setInput('pagination', pagination);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await setPagination(buildPagination());
    expect(component).toBeTruthy();
  });

  it('should render only page 1 when there is a single page', async () => {
    await setPagination(buildPagination({ pages: 1, current: 1 }));
    expect(component.pages()).toEqual([1]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.page-btn').length).toBe(1);
    expect(compiled.querySelectorAll('.page-ellipsis').length).toBe(0);
  });

  it('should build a page range with only a trailing ellipsis when current page is near the start', async () => {
    await setPagination(buildPagination({ pages: 5, current: 1 }));
    expect(component.pages()).toEqual([1, 2, 3, '...', 5]);
  });

  it('should build a page range with no ellipsis when all pages fit within the delta window', async () => {
    await setPagination(buildPagination({ pages: 5, current: 3 }));
    expect(component.pages()).toEqual([1, 2, 3, 4, 5]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.page-ellipsis').length).toBe(0);
  });

  it('should build a page range with ellipsis on both sides for a middle page', async () => {
    await setPagination(buildPagination({ pages: 20, current: 10 }));
    expect(component.pages()).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 20]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.page-ellipsis').length).toBe(2);
  });

  it('should mark the current page button as active', async () => {
    await setPagination(buildPagination({ pages: 5, current: 3 }));
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.page-btn'));
    const activeButton = buttons.find((btn) => btn.classList.contains('active'));
    expect(activeButton?.textContent?.trim()).toBe('3');
  });

  it('should dispatch changePage and scroll when a page button is clicked', async () => {
    await setPagination(buildPagination({ pages: 5, current: 1 }));
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.page-btn'));
    const pageTwoButton = buttons.find((btn) => btn.textContent?.trim() === '2');
    pageTwoButton?.click();

    expect(dispatchSpy).toHaveBeenCalledWith(changePage({ page: 2 }));
    expect(scrollToMock).toHaveBeenCalledWith(0, expect.anything());
  });

  it('goTo should dispatch changePage directly', async () => {
    await setPagination(buildPagination());
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.goTo(4);

    expect(dispatchSpy).toHaveBeenCalledWith(changePage({ page: 4 }));
    expect(scrollToMock).toHaveBeenCalledWith(0, expect.anything());
  });
});

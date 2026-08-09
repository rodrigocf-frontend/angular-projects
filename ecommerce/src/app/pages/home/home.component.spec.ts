import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import HomeComponent from './home.component';
import { ProductService } from '../../core/services/product/products.service';
import { ALL_PRODUCTS_MOCK } from '../../../mocks/models/products.mock';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let getFiltersMock: ReturnType<typeof vi.fn>;
  let getProductsMock: ReturnType<typeof vi.fn>;

  const filtersResponse = {
    categories: [{ name: 'Vestidos', slug: 'vestidos', count: 48, img: 'img.jpg' }],
    sizes: [{ name: 'M' }],
    colors: [{ name: 'Preto', hex: '#111111', checked: false }],
  };

  const productsResponse = {
    first: 1,
    prev: null,
    next: null,
    last: 1,
    pages: 1,
    items: 4,
    data: ALL_PRODUCTS_MOCK.slice(0, 4),
  };

  beforeEach(async () => {
    getFiltersMock = vi.fn(() => of(filtersResponse));
    getProductsMock = vi.fn(() => of(productsResponse));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: { getFilters: getFiltersMock, getProducts: getProductsMock },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request the filters and the featured products on init', () => {
    expect(getFiltersMock).toHaveBeenCalledTimes(1);
    expect(getProductsMock).toHaveBeenCalledWith({
      page: 1,
      sort: [{ name: 'Featured', type: 'featured' }],
      perPage: 4,
    });
  });

  it('should render hero, marquee, banner, newsletter and footer unconditionally', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-hero')).toBeTruthy();
    expect(compiled.querySelector('app-marquee')).toBeTruthy();
    expect(compiled.querySelector('app-banner')).toBeTruthy();
    expect(compiled.querySelector('app-newsletter')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should render categories once filters resolve', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-categories')).toBeTruthy();
  });

  it('should render highlight-products once featured products resolve', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-highlight-products')).toBeTruthy();
  });
});

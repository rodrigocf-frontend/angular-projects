import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OrderSummaryComponent } from './order-summary.component';
import {
  selectCartItems,
  selectCartTotal,
  selectTotalItems,
} from '../../../product-cart-page/store/product-cart.selectors';
import { CartProductItem } from '../../../product-cart-page/store/product-cart.reducers';
import { Product } from '../../../../shared/models/product.model';

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Vestido Midi',
    brand: 'Maison',
    description: 'desc',
    price: 100,
    originalPrice: null,
    discount: null,
    isNew: false,
    isSale: false,
    category: 'vestidos',
    images: [{ id: 'i1', url: 'http://img.test/1.jpg', alt: 'alt' }],
    sizes: 'P:true,M:true',
    colors: 'Bege:#c8a97e',
    composition: [],
    careInstructions: [],
    details: [],
    tags: [],
    rating: 4.5,
    reviewCount: 10,
    createdAt: '2024-01-01',
    ...overrides,
  };
}

const item: CartProductItem = {
  product: createProduct(),
  count: 2,
  color: { name: 'Bege', hex: '#c8a97e' },
  size: { label: 'M', available: true },
};

describe('OrderSummaryComponent', () => {
  let component: OrderSummaryComponent;
  let fixture: ComponentFixture<OrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummaryComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectCartItems, value: [item] },
            { selector: selectTotalItems, value: 1 },
            { selector: selectCartTotal, value: 250 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders items sourced from the store', () => {
    const names = fixture.nativeElement.querySelectorAll('.order-name');
    expect(names.length).toBe(1);
    expect(names[0].textContent).toContain('Vestido Midi');
    expect(fixture.nativeElement.querySelector('.order-qty').textContent).toContain('2');
  });

  it('renders the item price multiplied by its quantity', () => {
    const priceEl = fixture.nativeElement.querySelector('.order-price');
    // price 100 * count 2 = 200
    expect(priceEl.textContent).toContain('200');
  });

  it('renders the totals block when the total is truthy', () => {
    const totalEl = fixture.nativeElement.querySelector('.order-total-value');
    expect(totalEl).toBeTruthy();
    expect(totalEl.textContent).toContain('250');
  });
});

describe('OrderSummaryComponent - empty cart', () => {
  let fixture: ComponentFixture<OrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummaryComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectCartItems, value: [] },
            { selector: selectTotalItems, value: 0 },
            { selector: selectCartTotal, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('does not render any item rows', () => {
    expect(fixture.nativeElement.querySelectorAll('.order-item').length).toBe(0);
  });

  it('does not render the totals block when the total is 0 (falsy)', () => {
    expect(fixture.nativeElement.querySelector('.order-total-row')).toBeFalsy();
  });
});

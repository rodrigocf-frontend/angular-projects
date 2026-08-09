import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import ProductCartPageComponent from './product-cart-page.component';
import {
  selectCartIsEmpty,
  selectCartItems,
  selectCartTotal,
  selectTotalItems,
} from './store/product-cart.selectors';
import { setItemsInCart } from './store/product-cart.actions';
import { CartProductItem } from './store/product-cart.reducers';
import { Product } from '../../shared/models/product.model';
import { ProductColor, ProductSize } from '../../shared/utils/product';

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

const color: ProductColor = { name: 'Bege', hex: '#c8a97e' };
const size: ProductSize = { label: 'M', available: true };
const item: CartProductItem = { product: createProduct(), count: 2, color, size };

describe('ProductCartPageComponent', () => {
  let component: ProductCartPageComponent;
  let fixture: ComponentFixture<ProductCartPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCartPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectCartItems, value: [item] },
            { selector: selectTotalItems, value: 1 },
            { selector: selectCartTotal, value: 200 },
            { selector: selectCartIsEmpty, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCartPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders cart items sourced from the store', () => {
    const names = fixture.nativeElement.querySelectorAll('.cart-page-name');
    expect(names.length).toBe(1);
    expect(names[0].textContent).toContain('Vestido Midi');
    expect(fixture.nativeElement.querySelector('.cart-page-variants').textContent).toContain(
      'Bege',
    );
    expect(fixture.nativeElement.querySelector('.cart-page-variants').textContent).toContain('M');
  });

  it('shows the total item count', () => {
    const countEl = fixture.nativeElement.querySelector('.cart-page-count');
    expect(countEl.textContent).toContain('1');
  });

  it('renders the order summary total from the store', () => {
    const totalEl = fixture.nativeElement.querySelector('.order-total-value');
    expect(totalEl.textContent).toContain('200');
  });

  it('applies the grid layout class when the cart is not empty', () => {
    const cartPageEl = fixture.nativeElement.querySelector('.cart-page');
    expect(cartPageEl.classList.contains('cart-page-grid')).toBe(true);
  });

  it('dispatches setItemsInCart with an incremented count when adding', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.updateQuantity(item.product, item.count + 1, color, size);
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({ product: item.product, count: 3, color, size }),
    );
  });

  it('dispatches setItemsInCart with a decremented count when removing', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.updateQuantity(item.product, item.count - 1, color, size);
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({ product: item.product, count: 1, color, size }),
    );
  });

  it('dispatches setItemsInCart with a 0 count when removing the item entirely', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.updateQuantity(item.product, 0, color, size);
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({ product: item.product, count: 0, color, size }),
    );
  });

  it('dispatches an incremented count when the quantity control "+" is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const qtyBtns: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.cart-page-item .qty-btn'),
    );
    expect(qtyBtns.length).toBe(2);
    qtyBtns[1].click(); // "+" button
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({ product: item.product, count: item.count + 1, color, size }),
    );
  });

  it('dispatches a decremented count when the quantity control "−" is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const qtyBtns: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.cart-page-item .qty-btn'),
    );
    qtyBtns[0].click(); // "−" button
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({ product: item.product, count: item.count - 1, color, size }),
    );
  });

  it('dispatches a full removal when the Remover button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const removeBtn: HTMLButtonElement = Array.from(
      fixture.nativeElement.querySelectorAll('.cart-page-item button'),
    ).find(
      (btn) => (btn as HTMLButtonElement).textContent?.trim() === 'Remover',
    ) as HTMLButtonElement;
    expect(removeBtn).toBeTruthy();
    removeBtn.click();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({ product: item.product, count: 0, color, size }),
    );
  });
});

describe('ProductCartPageComponent - empty cart', () => {
  let fixture: ComponentFixture<ProductCartPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCartPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectCartItems, value: [] },
            { selector: selectTotalItems, value: 0 },
            { selector: selectCartTotal, value: 0 },
            { selector: selectCartIsEmpty, value: true },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCartPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the empty-cart state', () => {
    const emptyTitle = fixture.nativeElement.querySelector('.empty-title');
    expect(emptyTitle).toBeTruthy();
    expect(emptyTitle.textContent).toContain('Nada por');
  });

  it('does not render the order summary block when the total is 0', () => {
    expect(fixture.nativeElement.querySelector('.order-summary')).toBeFalsy();
  });

  it('does not apply the grid layout class when the cart is empty', () => {
    const cartPageEl = fixture.nativeElement.querySelector('.cart-page');
    expect(cartPageEl.classList.contains('cart-page-grid')).toBe(false);
  });

  it('links back to the collections page from the empty state', () => {
    const link = fixture.nativeElement.querySelector('.empty-actions a');
    expect(link.getAttribute('href')).toBe('/product/all');
  });
});

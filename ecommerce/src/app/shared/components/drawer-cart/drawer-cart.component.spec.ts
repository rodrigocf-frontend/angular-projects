import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { DrawerCartComponent } from './drawer-cart.component';
import {
  selectCartItems,
  selectCartTotal,
  selectDrawerOpen,
  selectTotalItems,
} from '../../../pages/product-cart-page/store/product-cart.selectors';
import {
  setItemsInCart,
  toggleCart,
} from '../../../pages/product-cart-page/store/product-cart.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { CartProductItem } from '../../../pages/product-cart-page/store/product-cart.reducers';

const CART_ITEM: CartProductItem = {
  product: MOCK_PRODUCT,
  count: 2,
  color: { name: 'Jeans Azul Vintage', hex: '#3b5998' },
  size: { label: 'M', available: true },
};

describe('DrawerCartComponent', () => {
  let fixture: ComponentFixture<DrawerCartComponent>;
  let component: DrawerCartComponent;
  let store: MockStore;

  async function setup(items: CartProductItem[] = [], open = false) {
    await TestBed.configureTestingModule({
      imports: [DrawerCartComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectCartItems, value: items },
            { selector: selectDrawerOpen, value: open },
            { selector: selectTotalItems, value: items.length },
            {
              selector: selectCartTotal,
              value: items.reduce((t, i) => t + i.product.price * i.count, 0),
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerCartComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should render the empty state when there are no items in the cart', async () => {
    await setup([]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty')).toBeTruthy();
    expect(compiled.querySelector('.cart-item')).toBeFalsy();
    expect(compiled.querySelector('.drawer-count')).toBeFalsy();
  });

  it('should not render the summary footer when the cart is empty', async () => {
    await setup([]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.drawer-summary')).toBeFalsy();
  });

  it('should render cart items and totals when the cart has items', async () => {
    await setup([CART_ITEM]);
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.cart-item');
    expect(items.length).toBe(1);
    expect(compiled.querySelector('.cart-item-brand')?.textContent).toContain(MOCK_PRODUCT.brand);
    expect(compiled.querySelector('.cart-item-name')?.textContent).toContain(MOCK_PRODUCT.name);
    expect(compiled.querySelector('.drawer-count')?.textContent).toContain('1 itens');
    expect(compiled.querySelector('.empty')).toBeFalsy();
  });

  it('should toggle the "open" class on the drawer based on open$', async () => {
    await setup([], true);
    const compiled = fixture.nativeElement as HTMLElement;
    const drawer = compiled.querySelector('.drawer');
    expect(drawer?.classList.contains('open')).toBe(true);
  });

  it('should not have the "open" class when drawer is closed', async () => {
    await setup([], false);
    const compiled = fixture.nativeElement as HTMLElement;
    const drawer = compiled.querySelector('.drawer');
    expect(drawer?.classList.contains('open')).toBe(false);
  });

  it('should dispatch toggleCart when close button is clicked', async () => {
    await setup([]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.drawer-close') as HTMLButtonElement).click();
    expect(dispatchSpy).toHaveBeenCalledWith(toggleCart());
  });

  it('should dispatch toggleCart when overlay is clicked', async () => {
    await setup([]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.drawer-overlay') as HTMLElement).click();
    expect(dispatchSpy).toHaveBeenCalledWith(toggleCart());
  });

  it('updateQuantity() should dispatch setItemsInCart with the given values', async () => {
    await setup([CART_ITEM]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.updateQuantity(MOCK_PRODUCT, 3, CART_ITEM.size, CART_ITEM.color);
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({
        product: MOCK_PRODUCT,
        count: 3,
        color: CART_ITEM.color,
        size: CART_ITEM.size,
      }),
    );
  });

  it('should dispatch setItemsInCart with an incremented count when the "+" stepper is clicked', async () => {
    await setup([CART_ITEM]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const addBtn = compiled.querySelectorAll('.qty-btn')[1] as HTMLButtonElement;
    addBtn.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({
        product: CART_ITEM.product,
        count: CART_ITEM.count + 1,
        color: CART_ITEM.color,
        size: CART_ITEM.size,
      }),
    );
  });

  it('should dispatch setItemsInCart with a decremented count when the "-" stepper is clicked', async () => {
    await setup([CART_ITEM]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const removeBtn = compiled.querySelectorAll('.qty-btn')[0] as HTMLButtonElement;
    removeBtn.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({
        product: CART_ITEM.product,
        count: CART_ITEM.count - 1,
        color: CART_ITEM.color,
        size: CART_ITEM.size,
      }),
    );
  });

  it('should dispatch setItemsInCart with count 0 when "Remover" is clicked', async () => {
    await setup([CART_ITEM]);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const removeLink = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Remover'),
    ) as HTMLButtonElement;
    removeLink.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setItemsInCart({
        product: CART_ITEM.product,
        count: 0,
        color: CART_ITEM.color,
        size: CART_ITEM.size,
      }),
    );
  });

  it('navigateToProducts() should navigate to /product/all and close the drawer', async () => {
    await setup([]);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.navigateToProducts();
    expect(navigateSpy).toHaveBeenCalledWith(['/product/all']);
    expect(dispatchSpy).toHaveBeenCalledWith(toggleCart());
  });

  it('navigateToCart() should navigate to /cart and close the drawer', async () => {
    await setup([]);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.navigateToCart();
    expect(navigateSpy).toHaveBeenCalledWith(['/cart']);
    expect(dispatchSpy).toHaveBeenCalledWith(toggleCart());
  });

  it('should navigate to product listing when "Ver coleções" is clicked from the empty state', async () => {
    await setup([]);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const compiled = fixture.nativeElement as HTMLElement;
    const seeCollectionsBtn = Array.from(compiled.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Ver coleções'),
    ) as HTMLButtonElement;
    seeCollectionsBtn.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/product/all']);
  });
});

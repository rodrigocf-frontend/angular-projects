import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { NavbarComponent } from './navbar.component';
import { selectTotalItems } from '../../../pages/product-cart-page/store/product-cart.selectors';
import { toggleCart } from '../../../pages/product-cart-page/store/product-cart.actions';

@Component({ template: '' })
class DummyRouteComponent {}

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([{ path: '**', component: DummyRouteComponent }]),
        provideMockStore({
          selectors: [{ selector: selectTotalItems, value: 0 }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the default header nav (not checkout route)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header__nav')).toBeTruthy();
    expect(compiled.querySelector('.header-back')).toBeFalsy();
  });

  it('should not render the cart badge when there are no items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header__cart-badge')).toBeFalsy();
  });

  it('should render the cart badge with item count when there are items', async () => {
    store.overrideSelector(selectTotalItems, 3);
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header__cart-badge')?.textContent).toContain('3');
  });

  it('should dispatch toggleCart when the cart button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const compiled = fixture.nativeElement as HTMLElement;
    const btn = compiled.querySelector('.header__cart-btn') as HTMLButtonElement;
    btn.click();
    expect(dispatchSpy).toHaveBeenCalledWith(toggleCart());
  });

  it('should switch to the checkout header when navigation ends on the checkout route', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/cart/checkout');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.currentRoute()).toBe('/cart/checkout');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header-back')).toBeTruthy();
    expect(compiled.querySelector('.header-secure')).toBeTruthy();
    expect(compiled.querySelector('.header__nav')).toBeFalsy();
  });
});

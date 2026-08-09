import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

import { AppComponent } from './app.component';
import { selectTotalItems } from './pages/product-cart-page/store/product-cart.selectors';
import { selectCartItems } from './pages/product-cart-page/store/product-cart.selectors';
import { selectDrawerOpen } from './pages/product-cart-page/store/product-cart.selectors';
import { selectCartTotal } from './pages/product-cart-page/store/product-cart.selectors';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectTotalItems, value: 0 },
            { selector: selectCartItems, value: [] },
            { selector: selectDrawerOpen, value: false },
            { selector: selectCartTotal, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the navbar, router-outlet and drawer-cart', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-drawer-cart')).toBeTruthy();
  });
});

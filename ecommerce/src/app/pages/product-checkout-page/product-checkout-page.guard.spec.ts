import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom, isObservable } from 'rxjs';
import { emptyCartGuard } from './product-checkout-page.guard';
import { selectCartIsEmpty } from '../product-cart-page/store/product-cart.selectors';

describe('emptyCartGuard', () => {
  let router: { createUrlTree: ReturnType<typeof vi.fn> };
  let store: MockStore;

  beforeEach(() => {
    router = { createUrlTree: vi.fn(() => 'URL_TREE' as any) };

    TestBed.configureTestingModule({
      providers: [provideMockStore(), { provide: Router, useValue: router }],
    });

    store = TestBed.inject(MockStore);
  });

  async function runGuard() {
    const result = TestBed.runInInjectionContext(() => emptyCartGuard({} as any, {} as any));
    return isObservable(result) ? firstValueFrom(result as any) : result;
  }

  it('redirects to /product/all when the cart is empty', async () => {
    store.overrideSelector(selectCartIsEmpty, true);
    store.refreshState();

    const result = await runGuard();

    expect(router.createUrlTree).toHaveBeenCalledWith(['/product/all']);
    expect(result).toBe('URL_TREE');
  });

  it('allows navigation when the cart is not empty', async () => {
    store.overrideSelector(selectCartIsEmpty, false);
    store.refreshState();

    const result = await runGuard();

    expect(router.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});

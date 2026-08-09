import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProductCartEffects } from './product-cart.effects';
import { ProductService } from '../../../core/services/product/products.service';
import { addProductInCart, setItemsInCart } from './product-cart.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ProductColor, ProductSize } from '../../../shared/utils/product';

describe('ProductCartEffects', () => {
  let effects: ProductCartEffects;
  let actions$: Subject<Action>;
  let productService: { getProduct: ReturnType<typeof vi.fn> };

  const color: ProductColor = { name: 'Black', hex: '#000' };
  const size: ProductSize = { label: 'M', available: true };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    productService = { getProduct: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ProductCartEffects,
        provideMockActions(() => actions$),
        { provide: ProductService, useValue: productService },
      ],
    });

    effects = TestBed.inject(ProductCartEffects);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('$onAddProductInCart', () => {
    it('fetches the product and emits setItemsInCart with product/count/color/size', () => {
      productService.getProduct.mockReturnValue(of(MOCK_PRODUCT));

      const emitted: Action[] = [];
      const sub = effects.$onAddProductInCart.subscribe((action) => emitted.push(action));

      actions$.next(addProductInCart({ id: MOCK_PRODUCT.id, count: 2, color, size }));

      expect(productService.getProduct).toHaveBeenCalledWith(MOCK_PRODUCT.id);
      expect(emitted).toEqual([setItemsInCart({ product: MOCK_PRODUCT, count: 2, color, size })]);
      sub.unsubscribe();
    });

    it('passes an undefined count through untouched', () => {
      productService.getProduct.mockReturnValue(of(MOCK_PRODUCT));

      const emitted: Action[] = [];
      const sub = effects.$onAddProductInCart.subscribe((action) => emitted.push(action));

      actions$.next(addProductInCart({ id: MOCK_PRODUCT.id, color, size }));

      expect(emitted).toEqual([
        setItemsInCart({ product: MOCK_PRODUCT, count: undefined, color, size }),
      ]);
      sub.unsubscribe();
    });

    // catchError is scoped inside the inner switchMap pipe (see product-cart.effects.ts), so a
    // single failed request must not kill the outer effect stream for future dispatches.
    it('keeps reacting to addProductInCart after a previous dispatch errored', () => {
      productService.getProduct.mockReturnValueOnce(throwError(() => new Error('boom')));

      const emitted: Action[] = [];
      let completed = false;
      const sub = effects.$onAddProductInCart.subscribe({
        next: (action) => emitted.push(action),
        complete: () => {
          completed = true;
        },
      });

      actions$.next(addProductInCart({ id: 'bad-id', color, size }));

      expect(emitted).toEqual([]);
      expect(completed).toBe(false);

      productService.getProduct.mockReturnValueOnce(of(MOCK_PRODUCT));
      actions$.next(addProductInCart({ id: MOCK_PRODUCT.id, count: 1, color, size }));

      expect(emitted).toEqual([setItemsInCart({ product: MOCK_PRODUCT, count: 1, color, size })]);
      sub.unsubscribe();
    });
  });
});

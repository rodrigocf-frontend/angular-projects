import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ProductsDetailsPageEffects } from './product-details.effects';
import { ProductService } from '../../../core/services/product/products.service';
import {
  loadProduct,
  setIsLoading,
  setProduct,
  setRelatedProducts,
} from './product-details.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';

describe('ProductsDetailsPageEffects', () => {
  let effects: ProductsDetailsPageEffects;
  let actions$: Subject<Action>;
  let productService: {
    getProduct: ReturnType<typeof vi.fn>;
    getRelatedProducts: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    productService = {
      getProduct: vi.fn(),
      getRelatedProducts: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductsDetailsPageEffects,
        provideMockActions(() => actions$),
        { provide: ProductService, useValue: productService },
      ],
    });

    effects = TestBed.inject(ProductsDetailsPageEffects);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('$loadPage', () => {
    it('emits setProduct, setRelatedProducts and setIsLoading(false) on success', () => {
      const related = ALL_PRODUCTS_MOCK.slice(0, 4);
      productService.getProduct.mockReturnValue(of(MOCK_PRODUCT));
      productService.getRelatedProducts.mockReturnValue(of({ data: related }));

      const emitted: Action[] = [];
      const sub = effects.$loadPage.subscribe((action) => emitted.push(action));

      actions$.next(loadProduct({ id: MOCK_PRODUCT.id }));

      expect(productService.getProduct).toHaveBeenCalledWith(MOCK_PRODUCT.id);
      expect(productService.getRelatedProducts).toHaveBeenCalledWith(MOCK_PRODUCT);
      expect(emitted).toEqual([
        setProduct({ product: MOCK_PRODUCT }),
        setRelatedProducts({ products: related }),
        setIsLoading({ isLoading: false }),
      ]);
      sub.unsubscribe();
    });

    it('emits setIsLoading(false) when getProduct fails', () => {
      productService.getProduct.mockReturnValueOnce(throwError(() => new Error('boom')));

      const emitted: Action[] = [];
      const sub = effects.$loadPage.subscribe((action) => emitted.push(action));

      actions$.next(loadProduct({ id: 'missing-id' }));

      expect(emitted).toEqual([setIsLoading({ isLoading: false })]);
      sub.unsubscribe();
    });

    it('emits setIsLoading(false) when getRelatedProducts fails', () => {
      productService.getProduct.mockReturnValueOnce(of(MOCK_PRODUCT));
      productService.getRelatedProducts.mockReturnValueOnce(throwError(() => new Error('boom')));

      const emitted: Action[] = [];
      const sub = effects.$loadPage.subscribe((action) => emitted.push(action));

      actions$.next(loadProduct({ id: MOCK_PRODUCT.id }));

      expect(emitted).toEqual([setIsLoading({ isLoading: false })]);
      sub.unsubscribe();
    });

    // catchError is scoped inside the inner switchMap pipe (see product-details.effects.ts),
    // so a single failed request must not kill the outer effect stream for future dispatches.
    it('keeps reacting to loadProduct after a previous dispatch errored', () => {
      productService.getProduct.mockReturnValueOnce(throwError(() => new Error('boom')));

      const emitted: Action[] = [];
      let completed = false;
      const sub = effects.$loadPage.subscribe({
        next: (action) => emitted.push(action),
        complete: () => {
          completed = true;
        },
      });

      actions$.next(loadProduct({ id: 'bad-id' }));

      expect(emitted).toEqual([setIsLoading({ isLoading: false })]);
      expect(completed).toBe(false);

      productService.getProduct.mockReturnValueOnce(of(MOCK_PRODUCT));
      productService.getRelatedProducts.mockReturnValueOnce(of({ data: [] }));
      actions$.next(loadProduct({ id: MOCK_PRODUCT.id }));

      expect(emitted).toEqual([
        setIsLoading({ isLoading: false }),
        setProduct({ product: MOCK_PRODUCT }),
        setRelatedProducts({ products: [] }),
        setIsLoading({ isLoading: false }),
      ]);
      sub.unsubscribe();
    });
  });

  describe('$loadingDetailsPage', () => {
    it('emits setIsLoading(true) whenever loadProduct is dispatched', () => {
      const emitted: Action[] = [];
      const sub = effects.$loadingDetailsPage.subscribe((action) => emitted.push(action));

      actions$.next(loadProduct({ id: 'a' }));
      actions$.next(loadProduct({ id: 'b' }));

      expect(emitted).toEqual([
        setIsLoading({ isLoading: true }),
        setIsLoading({ isLoading: true }),
      ]);
      sub.unsubscribe();
    });

    it('does not emit for unrelated actions', () => {
      const emitted: Action[] = [];
      const sub = effects.$loadingDetailsPage.subscribe((action) => emitted.push(action));

      actions$.next(setIsLoading({ isLoading: false }));

      expect(emitted).toEqual([]);
      sub.unsubscribe();
    });
  });
});

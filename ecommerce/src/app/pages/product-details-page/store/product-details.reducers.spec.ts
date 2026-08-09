import { productsDetailsReducer, ProductDetailsState } from './product-details.reducers';
import { setIsLoading, setProduct, setRelatedProducts } from './product-details.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';

const initialState: ProductDetailsState = {
  product: null,
  relatedProducts: [],
  isLoading: true,
};

describe('productsDetailsReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = productsDetailsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('setProduct should set the product', () => {
    const state = productsDetailsReducer(initialState, setProduct({ product: MOCK_PRODUCT }));
    expect(state.product).toBe(MOCK_PRODUCT);
    expect(state.relatedProducts).toEqual([]);
    expect(state.isLoading).toBe(true);
  });

  it('setRelatedProducts should set relatedProducts', () => {
    const products = ALL_PRODUCTS_MOCK.slice(0, 4);
    const state = productsDetailsReducer(initialState, setRelatedProducts({ products }));
    expect(state.relatedProducts).toEqual(products);
  });

  it('setIsLoading should set isLoading', () => {
    const state = productsDetailsReducer(initialState, setIsLoading({ isLoading: false }));
    expect(state.isLoading).toBe(false);
  });

  it('should not mutate the previous state object', () => {
    const state = productsDetailsReducer(initialState, setProduct({ product: MOCK_PRODUCT }));
    expect(state).not.toBe(initialState);
    expect(initialState.product).toBeNull();
  });
});

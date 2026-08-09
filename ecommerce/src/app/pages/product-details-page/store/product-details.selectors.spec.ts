import {
  selectDetailsPageLoading,
  selectProduct,
  selectRelatedProducts,
} from './product-details.selectors';
import { ProductDetailsState } from './product-details.reducers';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';

describe('product-details selectors', () => {
  const buildState = (overrides: Partial<ProductDetailsState> = {}) => ({
    productDetails: {
      product: null,
      relatedProducts: [],
      isLoading: true,
      ...overrides,
    } as ProductDetailsState,
  });

  it('selectProduct should return the current product', () => {
    const state = buildState({ product: MOCK_PRODUCT });
    expect(selectProduct(state)).toBe(MOCK_PRODUCT);
  });

  it('selectProduct should return null when there is no product loaded', () => {
    const state = buildState();
    expect(selectProduct(state)).toBeNull();
  });

  it('selectRelatedProducts should return the related products list', () => {
    const relatedProducts = ALL_PRODUCTS_MOCK.slice(0, 4);
    const state = buildState({ relatedProducts });
    expect(selectRelatedProducts(state)).toEqual(relatedProducts);
  });

  it('selectRelatedProducts should return an empty array by default', () => {
    const state = buildState();
    expect(selectRelatedProducts(state)).toEqual([]);
  });

  it('selectDetailsPageLoading should return the loading flag', () => {
    expect(selectDetailsPageLoading(buildState({ isLoading: true }))).toBe(true);
    expect(selectDetailsPageLoading(buildState({ isLoading: false }))).toBe(false);
  });
});

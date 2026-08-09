import {
  loadProduct,
  setIsLoading,
  setProduct,
  setRelatedProducts,
} from './product-details.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ALL_PRODUCTS_MOCK } from '../../../../mocks/models/products.mock';

describe('Product details actions', () => {
  it('loadProduct should create an action with id', () => {
    const action = loadProduct({ id: 'prod-001' });
    expect(action.type).toBe('[Product Details Page] - load product');
    expect(action.id).toBe('prod-001');
  });

  it('setProduct should create an action with product', () => {
    const action = setProduct({ product: MOCK_PRODUCT });
    expect(action.type).toBe('[Product Details Page] - set product');
    expect(action.product).toBe(MOCK_PRODUCT);
  });

  it('setRelatedProducts should create an action with products', () => {
    const products = ALL_PRODUCTS_MOCK.slice(0, 4);
    const action = setRelatedProducts({ products });
    expect(action.type).toBe('[Product Details Page] - set related products');
    expect(action.products).toBe(products);
  });

  it('setIsLoading should create an action with isLoading', () => {
    const action = setIsLoading({ isLoading: true });
    expect(action.type).toBe('[Product Details Page] - set Loading');
    expect(action.isLoading).toBe(true);
  });
});

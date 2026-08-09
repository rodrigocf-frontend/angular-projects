import { addProductInCart, clearCart, setItemsInCart, toggleCart } from './product-cart.actions';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import { ProductColor, ProductSize } from '../../../shared/utils/product';

describe('Product cart actions', () => {
  const color: ProductColor = { name: 'Black', hex: '#000' };
  const size: ProductSize = { label: 'M', available: true };

  it('toggleCart should create an action with no payload', () => {
    const action = toggleCart();
    expect(action.type).toBe('[Drawer Cart] - toogle');
  });

  it('addProductInCart should create an action with id/count/color/size', () => {
    const action = addProductInCart({ id: MOCK_PRODUCT.id, count: 2, color, size });
    expect(action.type).toBe('[Cart] - get and add product on cart');
    expect(action.id).toBe(MOCK_PRODUCT.id);
    expect(action.count).toBe(2);
    expect(action.color).toBe(color);
    expect(action.size).toBe(size);
  });

  it('addProductInCart should allow an undefined count', () => {
    const action = addProductInCart({ id: MOCK_PRODUCT.id, color, size });
    expect(action.count).toBeUndefined();
  });

  it('setItemsInCart should create an action with product/count/color/size', () => {
    const action = setItemsInCart({ product: MOCK_PRODUCT, count: 3, color, size });
    expect(action.type).toBe('[Cart] - set product on cart itens');
    expect(action.product).toBe(MOCK_PRODUCT);
    expect(action.count).toBe(3);
    expect(action.color).toBe(color);
    expect(action.size).toBe(size);
  });

  it('clearCart should create an action with no payload', () => {
    const action = clearCart();
    expect(action.type).toBe('[Cart] - clear products on cart');
  });
});

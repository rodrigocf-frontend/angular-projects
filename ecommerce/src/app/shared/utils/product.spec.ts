import { Product } from '../models/product.model';
import { getProductColors, getProductsSizes } from './product';

const makeProduct = (overrides: Partial<Product>): Product =>
  ({
    id: '1',
    name: 'Test',
    brand: 'Brand',
    description: '',
    price: 100,
    originalPrice: null,
    discount: null,
    isNew: false,
    isSale: false,
    category: 'cat',
    images: [],
    sizes: '',
    colors: '',
    composition: [],
    careInstructions: [],
    details: [],
    tags: [],
    rating: 0,
    reviewCount: 0,
    createdAt: '',
    ...overrides,
  }) as Product;

describe('getProductColors', () => {
  it('parses multiple "Name:#hex" entries', () => {
    const product = makeProduct({ colors: 'Bege:#c8a97e,Azul Marinho:#1b263b' });

    expect(getProductColors(product)).toEqual([
      { name: 'Bege', hex: '#c8a97e' },
      { name: 'Azul Marinho', hex: '#1b263b' },
    ]);
  });

  it('parses a single color entry', () => {
    const product = makeProduct({ colors: 'Preto:#000000' });

    expect(getProductColors(product)).toEqual([{ name: 'Preto', hex: '#000000' }]);
  });

  it('returns hex undefined for a malformed entry missing the colon', () => {
    const product = makeProduct({ colors: 'Preto' });

    expect(getProductColors(product)).toEqual([{ name: 'Preto', hex: undefined }]);
  });

  it('returns a single empty entry for an empty colors string', () => {
    const product = makeProduct({ colors: '' });

    expect(getProductColors(product)).toEqual([{ name: '', hex: undefined }]);
  });
});

describe('getProductsSizes', () => {
  it('parses multiple "Label:isAvailable" entries', () => {
    const product = makeProduct({ sizes: 'P:true,M:true,G:false,GG:true' });

    expect(getProductsSizes(product)).toEqual([
      { label: 'P', available: true },
      { label: 'M', available: true },
      { label: 'G', available: false },
      { label: 'GG', available: true },
    ]);
  });

  it('parses a single size entry', () => {
    const product = makeProduct({ sizes: 'U:true' });

    expect(getProductsSizes(product)).toEqual([{ label: 'U', available: true }]);
  });

  it('treats any non-"true" value as unavailable', () => {
    const product = makeProduct({ sizes: 'P:yes' });

    expect(getProductsSizes(product)).toEqual([{ label: 'P', available: false }]);
  });

  it('marks entries missing the availability flag as unavailable', () => {
    const product = makeProduct({ sizes: 'P' });

    expect(getProductsSizes(product)).toEqual([{ label: 'P', available: false }]);
  });

  it('returns a single unavailable empty entry for an empty sizes string', () => {
    const product = makeProduct({ sizes: '' });

    expect(getProductsSizes(product)).toEqual([{ label: '', available: false }]);
  });
});

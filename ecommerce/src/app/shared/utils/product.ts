import { Product } from '../models/product.model';

export interface ProductColor {
  name: string;
  hex: string;
}

export function getProductColors(product: Product): ProductColor[] {
  return product.colors.split(',').map((entry) => {
    const [name, hex] = entry.split(':');
    return { name, hex };
  });
}

export interface ProductSizes {
  label: string;
  available: boolean;
}

export function getProductsSizes(product: Product): ProductSizes[] {
  return product.sizes.split(',').map((entry) => {
    const [label, available] = entry.split(':');
    return { label, available: available === 'true' };
  });
}

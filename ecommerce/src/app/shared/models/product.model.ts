type ProductImage = {
  id: string;
  url: string;
  alt: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductSize = {
  label: string;
  stock: number;
};

type ProductVariant = {
  id: string;
  color: ProductColor;
  sizes: ProductSize[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  isNew: boolean;
  isSale: boolean;
  category: string;
  images: ProductImage[];
  variants: ProductVariant[];
  details: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

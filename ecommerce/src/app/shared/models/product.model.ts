type ProductImage = {
  id: string;
  url: string;
  alt: string;
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
  sizes: string;
  colors: string;
  details: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

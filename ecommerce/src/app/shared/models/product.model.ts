export type ProductImage = {
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
  // comma-separated "Label:isAvailable" pairs, e.g. "P:true,M:true,G:false,GG:true"
  sizes: string;
  // comma-separated "Nome:#hex" pairs, e.g. "Bege:#c8a97e,Azul Marinho:#1b263b"
  colors: string;
  composition: string[];
  careInstructions: string[];
  details: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

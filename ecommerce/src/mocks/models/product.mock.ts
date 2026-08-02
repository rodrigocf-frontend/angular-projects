import { Product } from '../../app/shared/models/product.model';

export const MOCK_PRODUCT: Product = {
  id: 'prod-001',
  name: 'Jaqueta Oversized Denim Vintage',
  brand: 'Urban Wear',
  description:
    'Jaqueta jeans oversized com lavagem vintage estilo anos 90, confeccionada em algodão pesado de alta durabilidade com acabamento premium e caimento despojado.',
  price: 299.9,
  originalPrice: 399.9,
  discount: 25, // 25% OFF
  isNew: true,
  isSale: true,
  category: 'Jaquetas',
  images: [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
      alt: 'Frente da Jaqueta Oversized Denim Vintage',
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
      alt: 'Costas da Jaqueta Oversized Denim Vintage',
    },
  ],
  sizes: 'P,M,G,GG',
  colors: 'Jeans Azul Vintage,Jeans Preto Desbotado',
  details: [
    '100% Algodão de alta gramatura',
    'Fechamento frontal por botões metálicos personalizáveis',
    'Dois bolsos na altura do peito com lapela',
    'Lavar à máquina com água fria',
  ],
  tags: ['Streetwear', 'Vintage', 'Jeans', 'Inverno', 'Promoção'],
  rating: 4.8,
  reviewCount: 42,
  createdAt: '2026-07-20T10:00:00.000Z',
};

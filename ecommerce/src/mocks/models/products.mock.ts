import { Product } from '../../app/shared/models/product.model';

const SIZES_STANDARD = [
  { label: 'P', stock: 5 },
  { label: 'M', stock: 8 },
  { label: 'G', stock: 3 },
  { label: 'GG', stock: 2 },
];

const SIZES_NUMERIC = [
  { label: '36', stock: 4 },
  { label: '38', stock: 6 },
  { label: '40', stock: 3 },
  { label: '42', stock: 1 },
];

const COLOR_PALETTE = {
  black: { name: 'Preto', hex: '#111111' },
  white: { name: 'Branco', hex: '#ffffff' },
  beige: { name: 'Bege', hex: '#c8a97e' },
  camel: { name: 'Caramelo', hex: '#8a7356' },
  grey: { name: 'Cinza Escuro', hex: '#666666' },
  brown: { name: 'Marrom', hex: '#4a3728' },
  pink: { name: 'Rosa Claro', hex: '#e8c4c4' },
  green: { name: 'Verde Escuro', hex: '#2c4a3e' },
};

export const ALL_PRODUCTS_MOCK: Product[] = [
  // ==========================================
  // VESTIDOS (48 itens)
  // ==========================================
  ...Array.from({ length: 48 }, (_, i) => {
    const idNum = i + 1;
    const isEven = idNum % 2 === 0;
    return {
      id: `vestido-${idNum}`,
      name: `Vestido ${['Midi Linho', 'Evasê Seda', 'Longo Crepe', 'Assimétrico', 'Slip Cetim', 'Chemise'][i % 6]} ${idNum}`,
      brand: 'Maison',
      description: 'Vestido sofisticado com corte impecável e tecido nobre de altíssima qualidade.',
      price: 250 + idNum * 12,
      originalPrice: isEven ? 300 + idNum * 12 : null,
      discount: isEven ? 15 : null,
      isNew: idNum % 3 === 0,
      isSale: isEven,
      category: 'Vestidos',
      images: [
        {
          id: `img-v-${idNum}`,
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          alt: `Vestido ${idNum}`,
        },
      ],
      variants: [
        {
          id: `var-v-${idNum}-1`,
          color: COLOR_PALETTE.black,
          sizes: SIZES_STANDARD,
        },
        {
          id: `var-v-${idNum}-2`,
          color: isEven ? COLOR_PALETTE.beige : COLOR_PALETTE.green,
          sizes: SIZES_NUMERIC,
        },
      ],
      details: ['Tecido encorpado', 'Fechamento por zíper invisível', 'Lavar a seco'],
      tags: ['Vestidos', 'Maison', 'Feminino'],
      rating: 4.5 + (idNum % 5) / 10,
      reviewCount: 10 + idNum,
      createdAt: '2026-07-01T10:00:00.000Z',
    };
  }),

  // ==========================================
  // BLAZERS (24 itens)
  // ==========================================
  ...Array.from({ length: 24 }, (_, i) => {
    const idNum = i + 1;
    return {
      id: `blazer-${idNum}`,
      name: `Blazer ${['Alfaiataria', 'Oversized', 'Acinturado', 'Acroppad'][i % 4]} ${idNum}`,
      brand: 'Maison',
      description: 'Blazer estruturado com ombreiras sutis e forro acetinado.',
      price: 450 + idNum * 15,
      originalPrice: null,
      discount: null,
      isNew: idNum % 2 === 0,
      isSale: false,
      category: 'Blazers',
      images: [
        {
          id: `img-b-${idNum}`,
          url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800',
          alt: `Blazer ${idNum}`,
        },
      ],
      variants: [
        {
          id: `var-b-${idNum}-1`,
          color: COLOR_PALETTE.black,
          sizes: SIZES_STANDARD,
        },
        {
          id: `var-b-${idNum}-2`,
          color: COLOR_PALETTE.camel,
          sizes: SIZES_NUMERIC,
        },
      ],
      details: ['Corte de alfaiataria', 'Botões forrados', 'Forro 100% viscose'],
      tags: ['Blazers', 'Alfaiataria', 'Workwear'],
      rating: 4.8,
      reviewCount: 15 + idNum,
      createdAt: '2026-06-15T10:00:00.000Z',
    };
  }),

  // ==========================================
  // CALÇAS (36 itens)
  // ==========================================
  ...Array.from({ length: 36 }, (_, i) => {
    const idNum = i + 1;
    return {
      id: `calca-${idNum}`,
      name: `Calça ${['Pantadona Linho', 'Wide Leg', 'Straight Alfaiataria', 'Cenoura'][i % 4]} ${idNum}`,
      brand: 'Maison',
      description: 'Calça de cintura alta com excelente caimento e conforto.',
      price: 320 + idNum * 10,
      originalPrice: idNum % 4 === 0 ? 400 + idNum * 10 : null,
      discount: idNum % 4 === 0 ? 20 : null,
      isNew: false,
      isSale: idNum % 4 === 0,
      category: 'Calças',
      images: [
        {
          id: `img-c-${idNum}`,
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
          alt: `Calça ${idNum}`,
        },
      ],
      variants: [
        {
          id: `var-c-${idNum}-1`,
          color: COLOR_PALETTE.grey,
          sizes: SIZES_NUMERIC,
        },
        {
          id: `var-c-${idNum}-2`,
          color: COLOR_PALETTE.white,
          sizes: SIZES_STANDARD,
        },
      ],
      details: ['Cintura alta', 'Passantes para cinto', 'Bolsos faca laterais'],
      tags: ['Calças', 'Casual', 'Elegante'],
      rating: 4.6,
      reviewCount: 8 + idNum,
      createdAt: '2026-05-20T10:00:00.000Z',
    };
  }),

  // ==========================================
  // SAIAS (18 itens)
  // ==========================================
  ...Array.from({ length: 18 }, (_, i) => {
    const idNum = i + 1;
    return {
      id: `saia-${idNum}`,
      name: `Saia ${['Midi Evasê', 'Lápis Cetim', 'Plissada', 'Assimétrica'][i % 4]} ${idNum}`,
      brand: 'Maison',
      description: 'Saia feminina e fluida perfeita para composições elegantes.',
      price: 280 + idNum * 14,
      originalPrice: null,
      discount: null,
      isNew: idNum % 2 !== 0,
      isSale: false,
      category: 'Saias',
      images: [
        {
          id: `img-s-${idNum}`,
          url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
          alt: `Saia ${idNum}`,
        },
      ],
      variants: [
        {
          id: `var-s-${idNum}-1`,
          color: COLOR_PALETTE.pink,
          sizes: SIZES_STANDARD,
        },
        {
          id: `var-s-${idNum}-2`,
          color: COLOR_PALETTE.black,
          sizes: SIZES_STANDARD,
        },
      ],
      details: ['Modelagem fluida', 'Cós estruturado', 'Toque suave'],
      tags: ['Saias', 'Feminino'],
      rating: 4.7,
      reviewCount: 12 + idNum,
      createdAt: '2026-06-01T10:00:00.000Z',
    };
  }),

  // ==========================================
  // ACESSÓRIOS (62 itens)
  // ==========================================
  ...Array.from({ length: 62 }, (_, i) => {
    const idNum = i + 1;
    return {
      id: `acessorio-${idNum}`,
      name: `${['Cinto Couro', 'Bolsa Crossbody', 'Brinco Argola', 'Colar Camadas', 'Óculos de Sol'][i % 5]} ${idNum}`,
      brand: 'Maison',
      description: 'Acessório refinado para complementar seu look com sofisticação.',
      price: 200 + idNum * 8,
      originalPrice: null,
      discount: null,
      isNew: idNum % 5 === 0,
      isSale: false,
      category: 'Acessórios',
      images: [
        {
          id: `img-a-${idNum}`,
          url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
          alt: `Acessório ${idNum}`,
        },
      ],
      variants: [
        {
          id: `var-a-${idNum}-1`,
          color: COLOR_PALETTE.brown,
          sizes: [{ label: 'Único', stock: 15 }],
        },
        {
          id: `var-a-${idNum}-2`,
          color: COLOR_PALETTE.black,
          sizes: [{ label: 'Único', stock: 20 }],
        },
      ],
      details: ['Acabamento artesanal', 'Detalhes banhados', 'Design exclusivo'],
      tags: ['Acessórios', 'Moda'],
      rating: 4.9,
      reviewCount: 20 + idNum,
      createdAt: '2026-07-10T10:00:00.000Z',
    };
  }),
];

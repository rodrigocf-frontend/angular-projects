import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../../shared/models/product.model';
import {
  clearFilter,
  FilterType,
  setFilter,
  setProducts,
  setupProductsFilter,
} from './products.actions';
import { countBy, entries } from 'lodash-es';

export interface ProductFilter {
  name: string;
  checked: boolean;
}

export interface CategoryFilter extends ProductFilter {
  count: number;
}

export interface SizeFilter extends ProductFilter {}

export interface ColorFilter extends ProductFilter {
  hex: string;
}

export interface PriceFilter extends ProductFilter {
  type: 'fromPrice' | 'toPrice';
  value: number;
}

export interface FiltersPagination {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
  current: number;
}

export interface Filters {
  pagination: FiltersPagination;
  categories: CategoryFilter[];
  sizes: SizeFilter[];
  colors: ColorFilter[];
  fromPrice: PriceFilter;
  toPrice: PriceFilter;
}

export interface ProductsState {
  list: Product[];
  filters: Filters;
}

export interface AppState {
  products: ProductsState;
}

const initialState: ProductsState = {
  list: [],
  filters: {
    pagination: {
      first: 1,
      prev: 0,
      next: 0,
      last: 0,
      pages: 0,
      items: 0,
      current: 1,
    },
    categories: [],
    sizes: [],
    colors: [],
    toPrice: {
      type: 'toPrice',
      value: 0,
      name: '',
      checked: false,
    },
    fromPrice: {
      type: 'fromPrice',
      value: 0,
      name: '',
      checked: false,
    },
  },
};

const setupFilters = (products: Product[]) => {
  const categories = setupCategories(products);
  const sizes = setupSizes(products);
  const colors = setupColors(products);
  return {
    categories,
    sizes,
    colors,
  };
};

const setupCategories = (products: Product[]): CategoryFilter[] => {
  const count = countBy(products, 'category');
  const entriesCategories = entries(count);
  return entriesCategories.map((c) => ({
    name: c[0],
    count: c[1],
    checked: false,
  }));
};

const setupSizes = (products: Product[]): SizeFilter[] => {
  const sizes: string[] = [];
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      variant.sizes.forEach((size) => {
        sizes.push(size.label);
      });
    });
  });

  const sizesArray = Array.from(new Set(sizes));

  return sizesArray.map((size) => ({
    name: size,
    checked: false,
  }));
};

const setupColors = (products: Product[]): ColorFilter[] => {
  const colors: ColorFilter[] = [];
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      colors.push({
        ...variant.color,
        checked: false,
      });
    });
  });

  const colorsValues = new Map(colors.map((item) => [item.name, item])).values();

  return Array.from(colorsValues);
};

const checkFilter = <T extends ProductFilter>(filters: T[], productFilter?: T) => {
  return filters.map((item) => {
    if (item.name === productFilter?.name) {
      if (item.checked) {
        return {
          ...item,
          checked: false,
        };
      }
      return {
        ...item,
        checked: true,
      };
    }
    return item;
  });
};

export function isColorFilter(filter: any): filter is ColorFilter {
  return typeof filter === 'object' && filter !== null && 'hex' in filter;
}

export function isCategoryFilter(filter: any): filter is CategoryFilter {
  return typeof filter === 'object' && filter !== null && 'count' in filter;
}

export function isSizeFilter(filter: any): filter is SizeFilter {
  return (
    typeof filter === 'object' && filter !== null && !('hex' in filter) && !('count' in filter)
  );
}

export function isPriceFilter(filter: any): filter is PriceFilter {
  return typeof filter === 'object' && filter !== null && 'value' in filter;
}

export const productsReducer = createReducer(
  initialState,
  on(setProducts, (state, { products }) => {
    return {
      ...state,
      list: products,
    };
  }),
  on(setupProductsFilter, (state, { products, pagination }) => {
    const { categories, colors, sizes } = setupFilters(products);
    return {
      ...state,
      filters: {
        ...state.filters,
        pagination,
        categories,
        sizes,
        colors,
      },
    };
  }),
  on(setFilter, (state, { filterType, color, category, size, price }) => {
    switch (filterType) {
      case FilterType.color:
        return {
          ...state,
          filters: {
            ...state.filters,
            colors: checkFilter<ColorFilter>(state.filters.colors, color),
          },
        };
      case FilterType.category:
        return {
          ...state,
          filters: {
            ...state.filters,
            categories: checkFilter<CategoryFilter>(state.filters.categories, category),
          },
        };
      case FilterType.size:
        return {
          ...state,
          filters: {
            ...state.filters,
            sizes: checkFilter<SizeFilter>(state.filters.sizes, size),
          },
        };
      case FilterType.price:
        if (price?.type === 'fromPrice') {
          return {
            ...state,
            filters: {
              ...state.filters,
              fromPrice: { ...price, name: `A partir de R$ ${price.value}` },
            },
          };
        } else if (price?.type === 'toPrice') {
          return {
            ...state,
            filters: {
              ...state.filters,
              toPrice: { ...price, name: `Até R$ ${price.value}` },
            },
          };
        }
        return state;
      default:
        return state;
    }
  }),
  on(clearFilter, (state) => {
    const { categories, colors, sizes } = setupFilters(state.list);

    return {
      ...state,
      filters: {
        ...state.filters,
        categories,
        colors,
        sizes,
        toPrice: {
          ...state.filters.toPrice,
          value: 0,
          checked: false,
        },
        fromPrice: {
          ...state.filters.fromPrice,
          value: 0,
          checked: false,
        },
      },
    };
  }),
);

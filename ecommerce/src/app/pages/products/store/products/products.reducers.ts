import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../../shared/models/product.model';
import {
  changePage,
  clearFilter,
  FilterType,
  setFilter,
  setProducts,
  configFilters,
  configPagination,
  setPagination,
  setSort,
} from './products.actions';
import {
  CategoryFilterFromApi,
  ColorFilterFromApi,
  FiltersApiResponse,
  SizeFilterFromApi,
} from '../../../../core/services/product/product-filter.service';

export interface ProductFilterCheck {
  checked: boolean;
}

export interface ProductFilter {
  name: string;
}

export interface CategoryFilter extends ProductFilter, ProductFilterCheck {
  count: number;
}

export interface SizeFilter extends ProductFilter, ProductFilterCheck {}

export interface ColorFilter extends ProductFilter, ProductFilterCheck {
  hex: string;
}

export interface PriceFilter extends ProductFilter {
  type: 'fromPrice' | 'toPrice';
  value: number | null;
}

export interface SortFilter extends ProductFilter {
  type: 'relevance' | 'min-price' | 'max-price' | 'newest';
}

export interface Pagination {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
}

export interface FiltersPagination extends Pagination {
  current: number;
}

export interface Filters {
  categories: CategoryFilter[];
  sizes: SizeFilter[];
  colors: ColorFilter[];
  fromPrice: PriceFilter[];
  toPrice: PriceFilter[];
  sort: SortFilter[];
}

export interface ProductsState {
  list: Product[];
  filters: Filters;
  pagination: FiltersPagination;
}

export interface AppState {
  products: ProductsState;
}

const initialState: ProductsState = {
  list: [],
  filters: {
    categories: [],
    sizes: [],
    colors: [],
    toPrice: [],
    fromPrice: [],
    sort: [],
  },
  pagination: {
    first: 0,
    prev: 0,
    next: 0,
    last: 0,
    pages: 0,
    items: 0,
    current: 0,
  },
};

const setupFilters = (filters: FiltersApiResponse) => {
  const categories = setupCategories(filters.categories);
  const sizes = setupSizes(filters.sizes);
  const colors = setupColors(filters.colors);
  return {
    categories,
    sizes,
    colors,
  };
};

const setupCategories = (categories: CategoryFilterFromApi[]): CategoryFilter[] => {
  return categories.map((c) => ({
    ...c,
    checked: false,
  }));
};

const setupSizes = (sizes: SizeFilterFromApi[]): SizeFilter[] => {
  return sizes.map((s) => ({
    ...s,
    checked: false,
  }));
};

const setupColors = (colors: ColorFilterFromApi[]): ColorFilter[] => {
  return colors.map((c) => ({
    ...c,
    checked: false,
  }));
};

const checkFilter = <T extends ProductFilter & ProductFilterCheck>(
  filters: T[],
  productFilter?: T,
) => {
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
  on(configFilters, (state, { filters }) => {
    const { categories, colors, sizes } = setupFilters(filters);
    return {
      ...state,
      filters: {
        ...state.filters,
        categories,
        colors,
        sizes,
      },
    };
  }),
  on(configPagination, (state, { pagination }) => {
    return {
      ...state,
      pagination: {
        ...pagination,
        current: 1,
      },
    };
  }),
  on(setPagination, (state, { pagination }) => {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        ...pagination,
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
              fromPrice: [
                {
                  ...price,
                },
              ],
            },
          };
        } else if (price?.type === 'toPrice') {
          return {
            ...state,
            filters: {
              ...state.filters,
              toPrice: [{ ...price }],
            },
          };
        }
        return state;
      default:
        return state;
    }
  }),
  on(changePage, (state, { page }) => {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        current: page,
      },
    };
  }),
  on(clearFilter, (state) => {
    return {
      ...state,
      ...initialState,
    };
  }),
  on(setSort, (state, { sort }) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        sort: [sort],
      },
    };
  }),
);

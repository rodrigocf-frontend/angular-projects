import { createReducer, on } from '@ngrx/store';
import { Product } from '../../../../shared/models/product.model';
import {
  changePage,
  clearFilter,
  FilterType,
  loadProducts,
  setFilter,
  setProducts,
  configFilters,
  configPagination,
  setPagination,
  setSort,
  setLoading,
  setFetched,
  setError,
} from './products.actions';
import {
  CategoryFilterFromApi,
  ColorFilterFromApi,
  FiltersApiResponse,
  SizeFilterFromApi,
} from '../../../../core/services/product/products.service';

export interface ProductFilterCheck {
  checked: boolean;
}

export interface ProductFilter {
  name: string;
}

export interface CategoryFilter extends ProductFilter, ProductFilterCheck {
  count: number;
  img: string;
  slug: string;
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
  type: 'relevance' | 'min-price' | 'max-price' | 'newest' | 'sale' | 'featured';
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
  isLoading: boolean;
  isFetched: boolean;
  hasError: boolean;
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
  isLoading: true,
  isFetched: false,
  hasError: false,
};

const setupFilters = (
  filters: FiltersApiResponse,
  categoriesFromQueryParams?: CategoryFilter[],
) => {
  const categories = setupCategories(filters.categories, categoriesFromQueryParams);
  const sizes = setupSizes(filters.sizes);
  const colors = setupColors(filters.colors);
  return {
    categories,
    sizes,
    colors,
  };
};

const setupCategories = (
  categories: CategoryFilterFromApi[],
  categoriesFromQueryParams?: CategoryFilter[],
): CategoryFilter[] => {
  if (!categoriesFromQueryParams) {
    return categories.map((c) => ({
      ...c,
      checked: false,
    }));
  } else {
    return categories.map((c) => {
      if (c.slug === categoriesFromQueryParams[0]?.slug) {
        return {
          ...c,
          checked: true,
        };
      }
      return {
        ...c,
        checked: false,
      };
    });
  }
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
      hasError: false,
    };
  }),
  on(configFilters, (state, { filters, categoriesFromQueryParams }) => {
    const { categories, colors, sizes } = setupFilters(filters, categoriesFromQueryParams);

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
  on(loadProducts, (state, { sort }) => {
    if (!sort || sort.length === 0) return state;
    return {
      ...state,
      filters: {
        ...state.filters,
        sort,
      },
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
  on(setLoading, (state, { isLoading }) => {
    return {
      ...state,
      isLoading,
    };
  }),
  on(setFetched, (state) => {
    return {
      ...state,
      isFetched: true,
    };
  }),
  on(setError, (state, { hasError }) => {
    return {
      ...state,
      hasError,
    };
  }),
);

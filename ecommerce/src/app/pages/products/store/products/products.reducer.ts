import { createReducer, createSelector, on } from '@ngrx/store';
import { Product } from '../../../../shared/models/product.model';
import { clearFilter, FilterType, setFilter, setProducts } from './products.action';
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

export interface ProductsState {
  list: Product[];
  filters: {
    categories: CategoryFilter[];
    sizes: SizeFilter[];
    colors: ColorFilter[];
  };
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

function checkFilter<T>(filters: (ProductFilter & T)[], productFilter?: ProductFilter) {
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
}

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
export const productsReducer = createReducer(
  initialState,
  on(setProducts, (state, { products }) => {
    const { categories, colors, sizes } = setupFilters(products);
    return {
      ...state,
      list: products,
      filters: {
        categories,
        sizes,
        colors,
      },
    };
  }),
  on(setFilter, (state, { filterType, color, category, size }) => {
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
      default:
        return state;
    }
  }),
  on(clearFilter, (state) => {
    const { categories, colors, sizes } = setupFilters(state.list);

    return {
      ...state,
      filters: {
        categories,
        colors,
        sizes,
      },
    };
  }),
);

const selectProducts = (state: AppState) => state.products;
export const selectFilters = (state: AppState) => state.products.filters;

export const selectAllProducts = createSelector(selectProducts, (products) => products.list);

export const selectAllSizesProducts = createSelector(selectFilters, (filters) => filters.sizes);

export const selectFiltersActives = createSelector(
  selectFilters,
  ({ categories, colors, sizes }): ProductFilter[] => {
    const categoriesActives = categories.filter((item) => item.checked);
    const colorsActives = colors.filter((item) => item.checked);
    const sizesActives = sizes.filter((item) => item.checked);

    return [...categoriesActives, ...colorsActives, ...sizesActives];
  },
);

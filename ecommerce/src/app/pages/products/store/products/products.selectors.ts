import { createSelector } from '@ngrx/store';
import { AppState, CategoryFilter, Filters, ProductFilter } from './products.reducers';

export const selectFilters = (state: AppState) => state.products.filters;
export const selectPagination = (state: AppState) => state.products.pagination;
export const selectIsLoading = (state: AppState) => state.products.isLoading;
export const selectIsFetched = (state: AppState) => state.products.isFetched;
export const selectHasError = (state: AppState) => state.products.hasError;

export const selectCheckedFilters = createSelector(selectFilters, (state) => {
  return {
    categories: state.categories.filter((category) => category.checked),
    sizes: state.sizes.filter((size) => size.checked),
    colors: state.colors.filter((color) => color.checked),
    fromPrice: state.fromPrice,
    toPrice: state.toPrice,
    sort: state.sort,
  };
});

export const selectCheckedPagination = createSelector(selectPagination, (pagination) => {
  return pagination;
});

export const selectCheckIsFetched = createSelector(selectIsFetched, (isFetched) => {
  return {
    isFetched,
  };
});

//====

const filtersChecked = (filters: Filters) => {
  const categories = filters.categories.filter((item) => item.checked);
  const colors = filters.colors.filter((item) => item.checked);
  const sizes = filters.sizes.filter((item) => item.checked);

  return {
    ...filters,
    categories,
    colors,
    sizes,
    fromPrice: filters.fromPrice,
    toPrice: filters.toPrice,
  };
};

const selectProducts = (state: AppState) => state.products;

export const selectAllProducts = createSelector(selectProducts, (products) => products.list);

const selectCheckedFiltersV1 = createSelector(selectFilters, filtersChecked);

export const selectFiltersActives = createSelector(
  selectCheckedFiltersV1,
  ({ categories, colors, sizes, fromPrice, toPrice }): ProductFilter[] => {
    return [...categories, ...colors, ...sizes, ...fromPrice, ...toPrice];
  },
);

export const selectCategoriesActive = createSelector(
  selectCheckedFiltersV1,
  ({ categories }): CategoryFilter[] => {
    return categories;
  },
);

export const selectProductsFiltereds = createSelector(
  selectAllProducts,
  selectCheckedFiltersV1,
  (list, { categories, colors, sizes, fromPrice, toPrice }) => {
    const selectedCategoryNames = categories.map((c) => c.slug);
    const selectedColorHexes = colors.map((c) => c.hex);
    const selectedSizeNames = sizes.map((s) => s.name);

    return list.filter((product) => {
      const matchesCategory =
        selectedCategoryNames.length === 0 || selectedCategoryNames.includes(product.category);

      const matchesColor =
        selectedColorHexes.length === 0 ||
        product.colors.split(',').some((entry) => selectedColorHexes.includes(entry.split(':')[1]));

      const matchesSize =
        selectedSizeNames.length === 0 ||
        product.sizes.split(',').some((entry) => selectedSizeNames.includes(entry.split(':')[0]));

      const matchesFromPrice =
        fromPrice.length === 0 ||
        fromPrice[0].value === null ||
        product.price >= fromPrice[0].value;
      const matchesToPrice =
        toPrice.length === 0 || toPrice[0].value === null || product.price <= toPrice[0].value;

      return matchesCategory && matchesColor && matchesSize && matchesFromPrice && matchesToPrice;
    });
  },
);

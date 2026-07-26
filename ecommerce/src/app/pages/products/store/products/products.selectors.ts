import { createSelector } from '@ngrx/store';
import { AppState, Filters, ProductFilter } from './products.reducers';

const filtersChecked = (filters: Filters) => {
  const categories = filters.categories.filter((item) => item.checked);
  const colors = filters.colors.filter((item) => item.checked);
  const sizes = filters.sizes.filter((item) => item.checked);
  const fromPrice = filters.fromPrice.checked ? [filters.fromPrice] : [];
  const toPrice = filters.toPrice.checked ? [filters.toPrice] : [];

  return {
    ...filters,
    categories,
    colors,
    sizes,
    fromPrice,
    toPrice,
  };
};

const selectProducts = (state: AppState) => state.products;
export const selectFilters = (state: AppState) => state.products.filters;

export const selectAllProducts = createSelector(selectProducts, (products) => products.list);

const selectCheckedFilters = createSelector(selectFilters, filtersChecked);

export const selectFiltersActives = createSelector(
  selectCheckedFilters,
  ({ categories, colors, sizes, fromPrice, toPrice }): ProductFilter[] => {
    return [...categories, ...colors, ...sizes, ...fromPrice, ...toPrice];
  },
);

export const selectProductsFiltereds = createSelector(
  selectAllProducts,
  selectCheckedFilters,
  (list, { categories, colors, sizes }) => {
    const selectedCategoryNames = categories.map((c) => c.name);
    const selectedColorNames = colors.map((c) => c.name);
    const selectedSizeNames = sizes.map((s) => s.name);

    return list.filter((product) => {
      const matchesCategory =
        selectedCategoryNames.length === 0 || selectedCategoryNames.includes(product.category);

      const matchesColor =
        selectedColorNames.length === 0 ||
        product.variants.some((variant) => selectedColorNames.includes(variant.color.name));

      const matchesSize =
        selectedSizeNames.length === 0 ||
        product.variants.some((variant) =>
          variant.sizes.some((size) => selectedSizeNames.includes(size.label)),
        );

      return matchesCategory && matchesColor && matchesSize;
    });
  },
);

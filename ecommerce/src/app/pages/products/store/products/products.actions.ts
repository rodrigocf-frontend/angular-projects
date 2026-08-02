import { createAction, props } from '@ngrx/store';
import {
  CategoryFilter,
  ColorFilter,
  FiltersPagination,
  Pagination,
  PriceFilter,
  SizeFilter,
  SortFilter,
} from './products.reducers';
import { Product } from '../../../../shared/models/product.model';
import { FiltersApiResponse } from '../../../../core/services/product/product-filter.service';

export const loadProducts = createAction(
  '[Page Products] - Load Products',
  props<{ page: number }>(),
);

export const setProducts = createAction(
  '[Page Products] - Set Products',
  props<{
    products: Product[];
    items?: number;
  }>(),
);

export const configFilters = createAction(
  '[Page Products] - Configuration Filters',
  props<{
    filters: FiltersApiResponse;
    products: Product[];
  }>(),
);

export const configPagination = createAction(
  '[Page Products] - Configuration Pagination',
  props<{
    pagination: Pagination;
  }>(),
);

export const setPagination = createAction(
  '[Page Products] - Configuration Pagination',
  props<{
    pagination: Partial<FiltersPagination>;
  }>(),
);

export const changePage = createAction(
  '[Products Page] - Change Page',
  props<{
    page: number;
  }>(),
);

export const clearFilter = createAction(
  '[Products Page] - Clear Filters',
  props<{ page: number }>(),
);

export const setSort = createAction(
  '[Products Page] - Set List Order',
  props<{ sort: SortFilter }>(),
);

export const setFiltersSections = createAction(
  '[Page Products] - Set setFiltersSections Sucess',
  props<{
    pagination: FiltersPagination;
    products: Product[];
  }>(),
);

export enum FilterType {
  category,
  size,
  color,
  price,
}

export const setFilter = createAction(
  '[Products Page] - Add/Remove Filter',
  props<{
    page: number;
    filterType: FilterType;
    color?: ColorFilter;
    category?: CategoryFilter;
    size?: SizeFilter;
    price?: PriceFilter;
  }>(),
);

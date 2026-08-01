import { createAction, props } from '@ngrx/store';
import {
  CategoryFilter,
  ColorFilter,
  Filters,
  FiltersPagination,
  PriceFilter,
  SizeFilter,
} from './products.reducers';
import { Product } from '../../../../shared/models/product.model';
import { FiltersApiResponse } from '../../../../core/services/product/product-filter.service';

export const loadProducts = createAction(
  '[Page Products] - Load Products',
  props<{ page: number }>(),
);

export const setProducts = createAction(
  '[Page Products] - Set Products Sucess',
  props<{
    products: Product[];
  }>(),
);

export const setupProductsFilter = createAction(
  '[Page Products] - Set Filter Sucess',
  props<{
    filters: FiltersApiResponse;
    pagination: FiltersPagination;
    products: Product[];
  }>(),
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
    filterType: FilterType;
    color?: ColorFilter;
    category?: CategoryFilter;
    size?: SizeFilter;
    price?: PriceFilter;
  }>(),
);

export const changePage = createAction(
  '[Products Page] - change page',
  props<{
    page: number;
  }>(),
);

export const clearFilter = createAction('[Products Page] - Clear');

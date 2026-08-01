import { createAction, props } from '@ngrx/store';
import {
  CategoryFilter,
  ColorFilter,
  FiltersPagination,
  PriceFilter,
  SizeFilter,
} from './products.reducers';
import { Product } from '../../../../shared/models/product.model';

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

export const clearFilter = createAction('[Products Page] - Clear');

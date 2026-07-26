import { createAction, props } from '@ngrx/store';
import { Product } from '../../../../shared/models/product.model';
import { CategoryFilter, ColorFilter, PriceFilter, SizeFilter } from './products.reducers';

export const setProducts = createAction(
  '[Create Action]',
  props<{
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

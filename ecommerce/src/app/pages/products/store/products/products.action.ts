import { createAction, props } from '@ngrx/store';
import { Product } from '../../../../shared/models/product.model';
import { CategoryFilter, ColorFilter, SizeFilter } from './products.reducer';

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
}

export const setFilter = createAction(
  '[Products Page] - Add/Remove Filter',
  props<{
    filterType: FilterType;
    color?: ColorFilter;
    category?: CategoryFilter;
    size?: SizeFilter;
  }>(),
);

export const clearFilter = createAction('[Products Page] - Clear');

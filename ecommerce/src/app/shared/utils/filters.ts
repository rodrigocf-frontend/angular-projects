import { Params } from '@angular/router';
import { CategoryFilter, SortFilter } from '../../pages/products/store/products/products.reducers';

export const getRouteParams = (
  params: Params,
): {
  sort: SortFilter[];
  categories: CategoryFilter[];
} => {
  let sort: SortFilter[] = [];
  let categories: CategoryFilter[] = [];
  const isNew = params['new'];
  const isSale = params['sale'];
  const isCategory = params['category'];

  if (isNew && isValidQueryParams(isNew)) sort = [{ name: 'Novidades', type: 'newest' }];
  if (isSale && isValidQueryParams(isSale)) sort = [...sort, { name: '', type: 'sale' }];
  if (isCategory) categories = [{ checked: true, count: 0, img: '', name: '', slug: isCategory }];

  return {
    sort,
    categories,
  };
};

const isValidQueryParams = (param: any) => {
  const cleanText = param.trim().toLowerCase();
  return cleanText === 'true' || cleanText === 'false';
};

import { ActivatedRoute } from '@angular/router';
import { SortFilter } from '../../pages/products/store/products/products.reducers';

export const getRouteParams = (route: ActivatedRoute): SortFilter[] => {
  let sort: SortFilter[] = [];
  const isNew = route.snapshot.queryParams['new'];
  const isSale = route.snapshot.queryParams['sale'];

  if (isNew && isValidQueryParams(isNew)) sort = [{ name: 'Novidades', type: 'newest' }];
  if (isSale && isValidQueryParams(isSale)) sort = [...sort, { name: '', type: 'sale' }];
  return sort;
};

const isValidQueryParams = (param: any) => {
  const cleanText = param.trim().toLowerCase();
  return cleanText === 'true' || cleanText === 'false';
};

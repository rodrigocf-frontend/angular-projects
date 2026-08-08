import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectCartIsEmpty } from '../product-cart-page/store/product-cart.selectors';

export const emptyCartGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCartIsEmpty).pipe(
    take(1),
    map((isEmpty) => (isEmpty ? router.createUrlTree(['/product/all']) : true)),
  );
};

import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { ProductsPageEffects } from './pages/products/store/products/products.effects';
import { provideState } from '@ngrx/store';
import { productsReducer } from './pages/products/store/products/products.reducers';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'product',
    providers: [
      provideState({
        name: 'products',
        reducer: productsReducer,
      }),
    ],
    children: [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full',
      },
      {
        path: 'all',
        providers: [provideEffects(ProductsPageEffects)],
        loadComponent: () => import('./pages/products/products.component'),
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./pages/product-details-page/product-details-page.component'),
      },
      {
        path: '**',
        redirectTo: 'all',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

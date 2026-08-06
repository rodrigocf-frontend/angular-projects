import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { ProductsPageEffects } from './pages/products/store/products/products.effects';
import { provideState } from '@ngrx/store';
import { productsReducer } from './pages/products/store/products/products.reducers';
import { productsDetailsReducer } from './pages/product-details-page/store/product-details.reducers';
import { ProductsDetailsPageEffects } from './pages/product-details-page/store/product-details.effects';

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

      provideState({
        name: 'productDetails',
        reducer: productsDetailsReducer,
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
        providers: [provideEffects(ProductsDetailsPageEffects)],
        loadComponent: () => import('./pages/product-details-page/product-details-page.component'),
      },
      {
        path: '**',
        redirectTo: 'all',
      },
    ],
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/product-cart-page/product-cart-page.component'),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

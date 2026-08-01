import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { ProductsEffects } from './pages/products/store/products/products.effects';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products'),
    providers: [provideEffects(ProductsEffects)],
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products'),
  },
];

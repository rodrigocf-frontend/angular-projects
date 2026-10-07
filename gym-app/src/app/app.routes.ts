import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./presentation/pages/home/home.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/pages/login/login.component'),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

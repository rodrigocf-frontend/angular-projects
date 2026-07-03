import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/board/board').then((m) => m.Board),
  },
  {
    path: 'my-tasks',
    loadComponent: () => import('./pages/my-tasks/my-tasks').then((m) => m.MyTasks),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar/calendar').then((m) => m.Calendar),
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports').then((m) => m.Reports),
  },
];

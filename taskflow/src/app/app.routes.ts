import { Routes } from '@angular/router';
import { Board } from './pages/board/board';
import { MyTasks } from './pages/my-tasks/my-tasks';
import { Calendar } from './pages/calendar/calendar';
import { Reports } from './pages/reports/reports';

export const routes: Routes = [
  {
    path: '',
    component: Board,
  },
  {
    path: 'my-tasks',
    component: MyTasks,
  },
  {
    path: 'calendar',
    component: Calendar,
  },
  {
    path: 'reports',
    component: Reports,
  },
];

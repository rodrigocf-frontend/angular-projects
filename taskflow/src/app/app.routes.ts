import { Routes } from '@angular/router';
import { Board } from './pages/board/board';
import { MyTasks } from './pages/my-tasks/my-tasks';

export const routes: Routes = [
  {
    path: '',
    component: Board,
  },
  {
    path: 'my-tasks',
    component: MyTasks,
  },
];

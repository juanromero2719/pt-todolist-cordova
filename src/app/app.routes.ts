import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/todo/ui/todo.page').then(m => m.TodoPage),
  },
];

import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./pages/bookmarks/bookmarks'),
  },
  {
    path: 'tags',
    loadComponent: () => import('./pages/tags/tags'),
  },
  {
    path: 'stale',
    loadComponent: () => import('./pages/stale/stale'),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
]

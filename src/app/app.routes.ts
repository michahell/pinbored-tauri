import { Routes } from '@angular/router'
import { isAuthenticatedGuard } from './functions/is-authenticated-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./pages/bookmarks/bookmarks'),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'tags',
    loadComponent: () => import('./pages/tags/tags'),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'notes',
    loadComponent: () => import('./pages/notes/notes'),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings'),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
]

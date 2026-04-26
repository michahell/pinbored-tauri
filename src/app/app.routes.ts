import { Routes } from '@angular/router'
import { isAuthenticatedGuard } from './shared/functions/is-authenticated-guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: 'bookmarks',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/bookmarks/bookmarks'),
      },
      {
        path: ':hash',
        pathMatch: 'full',
        loadComponent: () => import('./pages/bookmark/bookmark'),
      },
    ],
  },
  {
    path: 'tags',
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/tags/tags'),
      },
      {
        path: ':hash',
        pathMatch: 'full',
        loadComponent: () => import('./pages/tag/tag'),
      },
    ],
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

import { CanActivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { LocalStore } from '../services/store/local-store'

export const isAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const store = inject(LocalStore)
  const username = store.get('username')
  const password = store.get('password')
  return Promise.all([username, password])
    .then(([username, password]) => !!username && !!password)
    .catch(() => false)
}

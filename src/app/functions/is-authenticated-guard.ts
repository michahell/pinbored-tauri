import { CanActivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { LocalStore } from '../services/store/local-store'

export const isAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const store = inject(LocalStore)
  const username = store.get<string>('username')
  const password = store.get<string>('password')
  return Promise.all([username, password])
    .then(([username, password]) => {
      console.log(
        `isAuthenticatedGuard invoked, username: ${username} / ${password}`
      )
      return !!username && !!password
    })
    .catch(() => {
      console.log(`isAuthenticatedGuard invoked, returning false`)
      return false
    })
}

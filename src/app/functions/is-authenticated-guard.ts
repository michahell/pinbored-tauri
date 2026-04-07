import { CanActivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { LocalStoreService } from '../services/store/local-store-service'

export const isAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const store = inject(LocalStoreService)
  const username = store.get<string>('username')
  const token = store.get<string>('token')
  return Promise.all([username, token])
    .then(([username, token]) => {
      console.log(`isAuthenticatedGuard invoked, username: ${username} / ${token}`)
      return !!username && !!token
    })
    .catch(() => {
      console.log(`isAuthenticatedGuard invoked, returning false`)
      return false
    })
}

import { CanActivateFn } from '@angular/router'
import { inject } from '@angular/core'
import { AuthenticationService } from './authentication-service'

export const isAuthenticatedGuard: CanActivateFn = async () => {
  const authenticationService = inject(AuthenticationService)

  return authenticationService.authenticate().catch(() => false)
}

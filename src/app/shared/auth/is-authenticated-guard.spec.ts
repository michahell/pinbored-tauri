import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { isAuthenticatedGuard } from './is-authenticated-guard'
import { AuthenticationService } from './authentication-service'

describe('isAuthenticatedGuard', () => {
  let mockAuthService: { authenticate: ReturnType<typeof vi.fn> }

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isAuthenticatedGuard(...guardParameters))

  beforeEach(() => {
    mockAuthService = { authenticate: vi.fn() }

    TestBed.configureTestingModule({
      providers: [{ provide: AuthenticationService, useValue: mockAuthService }],
    })
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })

  it('returns true when authentication succeeds', async () => {
    mockAuthService.authenticate.mockResolvedValue(true)

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(true)
  })

  it('returns false when username is missing', async () => {
    mockAuthService.authenticate.mockResolvedValue(false)

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })

  it('returns false when token is missing', async () => {
    mockAuthService.authenticate.mockResolvedValue(false)

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })

  it('returns false when both credentials are missing', async () => {
    mockAuthService.authenticate.mockResolvedValue(false)

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })

  it('returns false when store.get throws', async () => {
    mockAuthService.authenticate.mockRejectedValue(new Error('Storage unavailable'))

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })
})

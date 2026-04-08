import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { isAuthenticatedGuard } from './is-authenticated-guard'
import { LocalStoreService } from '../services/store/local-store-service'

describe('isAuthenticatedGuard', () => {
  let mockLocalStore: { get: ReturnType<typeof vi.fn> }

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isAuthenticatedGuard(...guardParameters))

  beforeEach(() => {
    mockLocalStore = { get: vi.fn() }

    TestBed.configureTestingModule({
      providers: [{ provide: LocalStoreService, useValue: mockLocalStore }],
    })
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })

  it('returns true when both username and token are stored', async () => {
    mockLocalStore.get.mockImplementation((key: string) =>
      Promise.resolve(key === 'username' ? 'michael' : 'mytoken')
    )

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(true)
  })

  it('returns false when username is missing', async () => {
    mockLocalStore.get.mockImplementation((key: string) =>
      Promise.resolve(key === 'token' ? 'mytoken' : undefined)
    )

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })

  it('returns false when token is missing', async () => {
    mockLocalStore.get.mockImplementation((key: string) =>
      Promise.resolve(key === 'username' ? 'michael' : undefined)
    )

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })

  it('returns false when both credentials are missing', async () => {
    mockLocalStore.get.mockResolvedValue(undefined)

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })

  it('returns false when store.get throws', async () => {
    mockLocalStore.get.mockRejectedValue(new Error('Storage unavailable'))

    const result = await executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(result).toBe(false)
  })
})

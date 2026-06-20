import { TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthenticationService } from './authentication-service'
import { PinboardService } from '@data-providers/pinboard'
import { SignalStore } from '@services/signal-store'

describe('AuthenticationService', () => {
  let service: AuthenticationService
  let authSignal: ReturnType<typeof signal<{ storedUsername: string; storedToken: string }>>
  let mockSignalStore: { auth: typeof authSignal; setAuth: ReturnType<typeof vi.fn>; deleteAuth: ReturnType<typeof vi.fn> }
  let mockPinboard: {
    getUserApiToken: ReturnType<typeof vi.fn>
    storedUsername: string
    storedToken: string
  }

  beforeEach(() => {
    authSignal = signal({ storedUsername: '', storedToken: '' })
    mockSignalStore = { auth: authSignal, setAuth: vi.fn(), deleteAuth: vi.fn() }
    mockPinboard = { getUserApiToken: vi.fn(), storedUsername: '', storedToken: '' }

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: SignalStore, useValue: mockSignalStore },
        { provide: PinboardService, useValue: mockPinboard },
      ],
    })
    service = TestBed.inject(AuthenticationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('initial authStatus is "checking"', () => {
    expect(service.authStatus()).toBe('checking')
  })

  describe('authenticate()', () => {
    it('returns false and sets status to "unauthenticated" when no stored auth and no input', async () => {
      const result = await service.authenticate()

      expect(result).toBe(false)
      expect(service.authStatus()).toBe('unauthenticated')
    })

    it('clears pinboard credentials when unauthenticated', async () => {
      mockPinboard.storedUsername = 'leftover'
      mockPinboard.storedToken = 'leftover'

      await service.authenticate()

      expect(mockPinboard.storedUsername).toBe('')
      expect(mockPinboard.storedToken).toBe('')
    })

    it('returns true and sets status to "authenticated" when stored credentials are valid', async () => {
      authSignal.set({ storedUsername: 'storeduser', storedToken: 'storedtoken' })
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      const result = await service.authenticate()

      expect(result).toBe(true)
      expect(service.authStatus()).toBe('authenticated')
    })

    it('saves credentials to pinboard service when authenticated via stored auth', async () => {
      authSignal.set({ storedUsername: 'storeduser', storedToken: 'storedtoken' })
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      await service.authenticate()

      expect(mockPinboard.storedUsername).toBe('storeduser')
      expect(mockPinboard.storedToken).toBe('storedtoken')
    })

    it('saves credentials to signal store when authenticated', async () => {
      authSignal.set({ storedUsername: 'storeduser', storedToken: 'storedtoken' })
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      await service.authenticate()

      expect(mockSignalStore.setAuth).toHaveBeenCalledWith('storeduser', 'storedtoken')
    })

    it('returns false and sets status to "unauthenticated" when API rejects stored credentials', async () => {
      authSignal.set({ storedUsername: 'storeduser', storedToken: 'storedtoken' })
      mockPinboard.getUserApiToken.mockResolvedValue(null)

      const result = await service.authenticate()

      expect(result).toBe(false)
      expect(service.authStatus()).toBe('unauthenticated')
    })

    it('authenticates with input credentials when no stored auth is available', async () => {
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'inputuser:inputtoken' })

      const result = await service.authenticate({ username: 'inputuser', token: 'inputtoken' })

      expect(result).toBe(true)
      expect(service.authStatus()).toBe('authenticated')
    })

    it('prefers provided input credentials over stored credentials', async () => {
      authSignal.set({ storedUsername: 'storeduser', storedToken: 'storedtoken' })
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      await service.authenticate({ username: 'inputuser', token: 'inputtoken' })

      expect(mockPinboard.storedUsername).toBe('inputuser')
    })

    it('returns false when both stored and input credentials are empty strings', async () => {
      const result = await service.authenticate({ username: '', token: '' })

      expect(result).toBe(false)
    })
  })

  describe('logout()', () => {
    it('clears auth from signal store', () => {
      service.logout()
      expect(mockSignalStore.deleteAuth).toHaveBeenCalled()
    })
  })
})

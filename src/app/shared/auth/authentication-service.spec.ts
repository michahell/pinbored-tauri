import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthenticationService } from './authentication-service'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'
import { PinboardService } from '@data-providers/pinboard'

describe('AuthenticationService', () => {
  let service: AuthenticationService
  let mockLocalStore: { get: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> }
  let mockPinboard: {
    getUserApiToken: ReturnType<typeof vi.fn>
    storedUsername: string
    storedToken: string
  }

  beforeEach(() => {
    mockLocalStore = { get: vi.fn(), set: vi.fn() }
    mockPinboard = { getUserApiToken: vi.fn(), storedUsername: '', storedToken: '' }

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: TauriStoreService, useValue: mockLocalStore },
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
      mockLocalStore.get.mockResolvedValue(undefined)

      const result = await service.authenticate()

      expect(result).toBe(false)
      expect(service.authStatus()).toBe('unauthenticated')
    })

    it('clears pinboard credentials when unauthenticated', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.storedUsername = 'leftover'
      mockPinboard.storedToken = 'leftover'

      await service.authenticate()

      expect(mockPinboard.storedUsername).toBe('')
      expect(mockPinboard.storedToken).toBe('')
    })

    it('returns true and sets status to "authenticated" when stored credentials are valid', async () => {
      mockLocalStore.get.mockImplementation((key: string) =>
        Promise.resolve(key === 'username' ? 'storeduser' : 'storedtoken')
      )
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      const result = await service.authenticate()

      expect(result).toBe(true)
      expect(service.authStatus()).toBe('authenticated')
    })

    it('saves credentials to pinboard service when authenticated via stored auth', async () => {
      mockLocalStore.get.mockImplementation((key: string) =>
        Promise.resolve(key === 'username' ? 'storeduser' : 'storedtoken')
      )
      mockLocalStore.set.mockResolvedValue(undefined)
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      await service.authenticate()

      expect(mockPinboard.storedUsername).toBe('storeduser')
      expect(mockPinboard.storedToken).toBe('storedtoken')
    })

    it('saves credentials to local store when authenticated', async () => {
      mockLocalStore.get.mockImplementation((key: string) =>
        Promise.resolve(key === 'username' ? 'storeduser' : 'storedtoken')
      )
      mockLocalStore.set.mockResolvedValue(undefined)
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      await service.authenticate()

      expect(mockLocalStore.set).toHaveBeenCalledWith('username', 'storeduser')
      expect(mockLocalStore.set).toHaveBeenCalledWith('token', 'storedtoken')
    })

    it('returns false and sets status to "unauthenticated" when API rejects stored credentials', async () => {
      mockLocalStore.get.mockImplementation((key: string) =>
        Promise.resolve(key === 'username' ? 'storeduser' : 'storedtoken')
      )
      mockPinboard.getUserApiToken.mockResolvedValue(null)

      const result = await service.authenticate()

      expect(result).toBe(false)
      expect(service.authStatus()).toBe('unauthenticated')
    })

    it('authenticates with input credentials when no stored auth is available', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'inputuser:inputtoken' })

      const result = await service.authenticate({ username: 'inputuser', token: 'inputtoken' })

      expect(result).toBe(true)
      expect(service.authStatus()).toBe('authenticated')
    })

    it('prefers provided input credentials over stored credentials', async () => {
      mockLocalStore.get.mockImplementation((key: string) =>
        Promise.resolve(key === 'username' ? 'storeduser' : 'storedtoken')
      )
      mockPinboard.getUserApiToken.mockResolvedValue({ result: 'storeduser:storedtoken' })

      await service.authenticate({ username: 'inputuser', token: 'inputtoken' })

      expect(mockPinboard.storedUsername).toBe('inputuser')
    })

    it('returns false when both stored and input credentials are empty strings', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)

      const result = await service.authenticate({ username: '', token: '' })

      expect(result).toBe(false)
    })
  })

  describe('logout()', () => {
    it('clears username from local store', async () => {
      mockLocalStore.set.mockResolvedValue(undefined)
      await service.logout()
      expect(mockLocalStore.set).toHaveBeenCalledWith('username', null)
    })

    it('clears token from local store', async () => {
      mockLocalStore.set.mockResolvedValue(undefined)
      await service.logout()
      expect(mockLocalStore.set).toHaveBeenCalledWith('token', null)
    })
  })
})

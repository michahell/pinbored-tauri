import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { LocalStoreService } from './local-store-service'

const mockStoreInstance = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  save: vi.fn(),
}))
const mockLoad = vi.hoisted(() => vi.fn())

vi.mock('@tauri-apps/plugin-store', () => ({
  load: (...args: unknown[]) => mockLoad(...args),
}))

describe('LocalStoreService', () => {
  let service: LocalStoreService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LocalStoreService)
    vi.clearAllMocks()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('before load()', () => {
    it('get() returns undefined when store is not initialized', async () => {
      expect(await service.get<string>('username')).toBeUndefined()
    })

    it('set() resolves without error when store is not initialized', async () => {
      await expect(service.set('key', 'value')).resolves.toBeUndefined()
    })

    it('save() resolves without error when store is not initialized', async () => {
      await expect(service.save()).resolves.toBeUndefined()
    })
  })

  describe('after load()', () => {
    beforeEach(async () => {
      mockLoad.mockResolvedValue(mockStoreInstance)
      await service.load()
    })

    it('load() calls the plugin with the correct path and options', () => {
      expect(mockLoad).toHaveBeenCalledWith('localstore.json', { defaults: {}, autoSave: 100 })
    })

    it('get() delegates to the underlying store', async () => {
      mockStoreInstance.get.mockResolvedValue('testuser')
      const result = await service.get<string>('username')
      expect(mockStoreInstance.get).toHaveBeenCalledWith('username')
      expect(result).toBe('testuser')
    })

    it('get() returns undefined for a missing key', async () => {
      mockStoreInstance.get.mockResolvedValue(undefined)
      expect(await service.get<string>('nonexistent')).toBeUndefined()
    })

    it('set() delegates to the underlying store', async () => {
      mockStoreInstance.set.mockResolvedValue(undefined)
      await service.set('username', 'michael')
      expect(mockStoreInstance.set).toHaveBeenCalledWith('username', 'michael')
    })

    it('save() delegates to the underlying store', async () => {
      mockStoreInstance.save.mockResolvedValue(undefined)
      await service.save()
      expect(mockStoreInstance.save).toHaveBeenCalled()
    })
  })
})

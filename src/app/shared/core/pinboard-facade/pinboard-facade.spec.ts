import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { PinboardFacade } from './pinboard-facade'
import { PinboardService } from '../pinboard-service/pinboard-service'
import { LocalStoreService } from '../store/local-store-service'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { PinboardItem } from '../../models/pinboard.model'

function makeRawBookmark(overrides: Partial<PinboardItem> = {}): PinboardItem {
  return {
    hash: 'abc123',
    href: 'https://example.com',
    description: 'Example',
    extended: '',
    meta: '',
    shared: 'no',
    tags: 'dev tools',
    time: '2024-01-01',
    toread: 'no',
    ...overrides,
  }
}

function makeStoredBookmark(overrides: Partial<PinboardItemVM> = {}): PinboardItemVM {
  return {
    hash: 'abc123',
    href: 'https://example.com',
    description: 'Example',
    extended: '',
    meta: '',
    shared: 'no',
    tags: 'dev tools',
    time: '2024-01-01',
    toread: 'no',
    tagsList: ['dev', 'tools'],
    status: 'unchecked',
    ...overrides,
  }
}

describe('PinboardFacade', () => {
  let facade: PinboardFacade
  let mockPinboard: {
    getAllBookmarks: ReturnType<typeof vi.fn>
    getAllTags: ReturnType<typeof vi.fn>
    renameTag: ReturnType<typeof vi.fn>
    deleteTag: ReturnType<typeof vi.fn>
    deleteBookmark: ReturnType<typeof vi.fn>
  }
  let mockLocalStore: {
    get: ReturnType<typeof vi.fn>
    set: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockPinboard = {
      getAllBookmarks: vi.fn(),
      getAllTags: vi.fn(),
      renameTag: vi.fn(),
      deleteTag: vi.fn(),
      deleteBookmark: vi.fn(),
    }
    mockLocalStore = {
      get: vi.fn().mockResolvedValue(undefined),
      set: vi.fn().mockResolvedValue(undefined),
    }

    TestBed.configureTestingModule({
      providers: [
        PinboardFacade,
        { provide: PinboardService, useValue: mockPinboard },
        { provide: LocalStoreService, useValue: mockLocalStore },
      ],
    })
    facade = TestBed.inject(PinboardFacade)
  })

  it('should be created', () => {
    expect(facade).toBeTruthy()
  })

  describe('getAllBookmarks()', () => {
    it('returns cached bookmarks from local store when available', async () => {
      const cached = [makeStoredBookmark()]
      mockLocalStore.get.mockResolvedValue(cached)

      const result = await facade.getAllBookmarks('cache')

      expect(result).toBe(cached)
      expect(mockPinboard.getAllBookmarks).not.toHaveBeenCalled()
    })

    it('fetches from PinboardService when no cached bookmarks exist', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getAllBookmarks.mockResolvedValue([makeRawBookmark()])

      await facade.getAllBookmarks('server')

      expect(mockPinboard.getAllBookmarks).toHaveBeenCalled()
    })

    it('maps raw bookmark tags string to tagsList array', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getAllBookmarks.mockResolvedValue([makeRawBookmark({ tags: 'dev tools react' })])

      const result = await facade.getAllBookmarks('server')

      expect(result[0].tagsList).toEqual(['dev', 'tools', 'react'])
    })

    it('sets status to "unchecked" for all fetched bookmarks', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getAllBookmarks.mockResolvedValue([makeRawBookmark({ hash: 'a' }), makeRawBookmark({ hash: 'b' })])

      const result = await facade.getAllBookmarks('server')

      expect(result.every((b) => b.status === 'unchecked')).toBe(true)
    })

    it('saves fetched bookmarks to local store', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getAllBookmarks.mockResolvedValue([makeRawBookmark()])

      await facade.getAllBookmarks('server')

      expect(mockLocalStore.set).toHaveBeenCalledWith('bookmarks', expect.any(Array))
    })

    it('preserves all raw bookmark fields in the mapped result', async () => {
      const raw = makeRawBookmark({ hash: 'xyz', href: 'https://test.com', description: 'Test' })
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getAllBookmarks.mockResolvedValue([raw])

      const result = await facade.getAllBookmarks('server')

      expect(result[0].hash).toBe('xyz')
      expect(result[0].href).toBe('https://test.com')
      expect(result[0].description).toBe('Test')
    })
  })

  describe('getAllTags()', () => {
    it('returns cached tags from local store when available', async () => {
      const cached = { dev: '5', tools: '3' }
      mockLocalStore.get.mockResolvedValue(cached)

      const result = await facade.getAllTags()

      expect(result).toBe(cached)
      expect(mockPinboard.getAllTags).not.toHaveBeenCalled()
    })

    it('fetches from PinboardService when no cached tags exist', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      mockPinboard.getAllTags.mockResolvedValue({ dev: '5' })

      await facade.getAllTags()

      expect(mockPinboard.getAllTags).toHaveBeenCalled()
    })

    it('saves fetched tags to local store', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      const tags = { dev: '5', tools: '3' }
      mockPinboard.getAllTags.mockResolvedValue(tags)

      await facade.getAllTags()

      expect(mockLocalStore.set).toHaveBeenCalledWith('tags', tags)
    })

    it('returns the fetched tags', async () => {
      mockLocalStore.get.mockResolvedValue(undefined)
      const tags = { angular: '12', tauri: '4' }
      mockPinboard.getAllTags.mockResolvedValue(tags)

      const result = await facade.getAllTags()

      expect(result).toEqual(tags)
    })
  })

  describe('renameTag()', () => {
    it('delegates to PinboardService.renameTag with correct arguments', async () => {
      mockPinboard.renameTag.mockResolvedValue({ result: 'done' })

      await facade.renameTag('oldName', 'newName')

      expect(mockPinboard.renameTag).toHaveBeenCalledWith('oldName', 'newName')
    })

    it('returns the result from PinboardService', async () => {
      mockPinboard.renameTag.mockResolvedValue({ result: 'done' })

      const result = await facade.renameTag('a', 'b')

      expect(result).toEqual({ result: 'done' })
    })
  })

  describe('deleteTag()', () => {
    it('delegates to PinboardService.deleteTag with the tag name', async () => {
      mockPinboard.deleteTag.mockResolvedValue({ result: 'done' })

      await facade.deleteTag('mytag')

      expect(mockPinboard.deleteTag).toHaveBeenCalledWith('mytag')
    })

    it('returns the result from PinboardService', async () => {
      mockPinboard.deleteTag.mockResolvedValue({ result: 'done' })

      const result = await facade.deleteTag('mytag')

      expect(result).toEqual({ result: 'done' })
    })
  })

  describe('deleteBookmark()', () => {
    it('delegates to PinboardService.deleteBookmark with the URL', async () => {
      mockPinboard.deleteBookmark.mockResolvedValue(undefined)

      await facade.deleteBookmark('https://example.com')

      expect(mockPinboard.deleteBookmark).toHaveBeenCalledWith('https://example.com')
    })
  })
})

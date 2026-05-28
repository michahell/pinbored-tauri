import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BookmarksService } from './bookmarks-service'
import { PinboardFacade } from '@core/pinboard-facade/pinboard-facade'
import { StaleCheckerService } from '../stale-checker/stale-checker-service'
import { LocalStoreService } from '@core/store/local-store-service'
import { PinboardItemVM } from '@models/pinboard-view.model'

vi.mock('@signality/core', () => ({
  interval: vi.fn(() => null),
}))

function makeBookmark(overrides: Partial<PinboardItemVM> = {}): PinboardItemVM {
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

describe('BookmarksService', () => {
  let service: BookmarksService
  let mockFacade: { getAllBookmarks: ReturnType<typeof vi.fn> }
  let mockQueue: {
    pause: ReturnType<typeof vi.fn>
    start: ReturnType<typeof vi.fn>
    clear: ReturnType<typeof vi.fn>
    isPaused: boolean
  }
  let mockStaleChecker: {
    newQueue: ReturnType<typeof vi.fn>
    startWith: ReturnType<typeof vi.fn>
  }
  let mockLocalStore: {
    get: ReturnType<typeof vi.fn>
    set: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockQueue = { pause: vi.fn(), start: vi.fn(), clear: vi.fn(), isPaused: false }
    mockFacade = { getAllBookmarks: vi.fn() }
    mockStaleChecker = {
      newQueue: vi.fn().mockReturnValue(mockQueue),
      startWith: vi.fn().mockResolvedValue(undefined),
    }
    mockLocalStore = {
      get: vi.fn().mockResolvedValue(undefined),
      set: vi.fn().mockResolvedValue(undefined),
    }

    TestBed.configureTestingModule({
      providers: [
        BookmarksService,
        { provide: PinboardFacade, useValue: mockFacade },
        { provide: StaleCheckerService, useValue: mockStaleChecker },
        { provide: LocalStoreService, useValue: mockLocalStore },
      ],
    })
    service = TestBed.inject(BookmarksService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('initial signal state', () => {
    it('bookmarks is empty', () => {
      expect(service.bookmarks()).toEqual([])
    })

    it('bookmarksFetching is false', () => {
      expect(service.bookmarksFetching()).toBe(false)
    })

    it('staleChecking is false', () => {
      expect(service.staleChecking()).toBe(false)
    })

    it('hasBookmarks is false', () => {
      expect(service.hasBookmarks()).toBe(false)
    })
  })

  describe('getAllBookmarks()', () => {
    it('sets bookmarks signal from the facade response', async () => {
      const items = [makeBookmark()]
      mockFacade.getAllBookmarks.mockResolvedValue(items)

      await service.getAllBookmarks()

      expect(service.bookmarks()).toEqual(items)
    })

    it('hasBookmarks becomes true once bookmarks are loaded', async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([makeBookmark()])

      await service.getAllBookmarks()

      expect(service.hasBookmarks()).toBe(true)
    })

    it('resets bookmarksFetching to false after completion', async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([makeBookmark()])

      await service.getAllBookmarks()

      expect(service.bookmarksFetching()).toBe(false)
    })

    it('sets bookmarks to [] when the facade throws', async () => {
      mockFacade.getAllBookmarks.mockRejectedValue(new Error('Network error'))

      await service.getAllBookmarks()

      expect(service.bookmarks()).toEqual([])
    })

    it('resets bookmarksFetching to false even when the facade throws', async () => {
      mockFacade.getAllBookmarks.mockRejectedValue(new Error('Network error'))

      await service.getAllBookmarks()

      expect(service.bookmarksFetching()).toBe(false)
    })
  })

  describe('startStaleCheck()', () => {
    beforeEach(async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([
        makeBookmark({ hash: 'a', status: 'unchecked' }),
        makeBookmark({ hash: 'b', status: 'ok' }),
      ])
      await service.getAllBookmarks()
    })

    it('creates a new queue via StaleCheckerService', async () => {
      await service.startStaleCheck()
      expect(mockStaleChecker.newQueue).toHaveBeenCalled()
    })

    it('only passes bookmarks with "unchecked" status to the checker', async () => {
      await service.startStaleCheck()

      const [, passedList] = mockStaleChecker.startWith.mock.calls[0]
      expect(passedList).toHaveLength(1)
      expect(passedList[0].hash).toBe('a')
    })
  })

  describe('pauseStaleCheck()', () => {
    it('calls pause on the queue', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any
      await service.pauseStaleCheck()
      expect(mockQueue.pause).toHaveBeenCalled()
    })

    it('sets staleChecking to false', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any
      await service.pauseStaleCheck()
      expect(service.staleChecking()).toBe(false)
    })
  })

  describe('resumeStaleCheck()', () => {
    it('calls start on the queue when paused', async () => {
      mockQueue.isPaused = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any

      await service.resumeStaleCheck()

      expect(mockQueue.start).toHaveBeenCalled()
    })

    it('sets staleChecking to true when resuming a paused queue', async () => {
      mockQueue.isPaused = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any

      await service.resumeStaleCheck()

      expect(service.staleChecking()).toBe(true)
    })

    it('does nothing when the queue is not paused', async () => {
      mockQueue.isPaused = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any

      await service.resumeStaleCheck()

      expect(mockQueue.start).not.toHaveBeenCalled()
    })
  })

  describe('stopStaleCheck()', () => {
    it('clears the queue', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any
      await service.stopStaleCheck()
      expect(mockQueue.clear).toHaveBeenCalled()
    })

    it('sets staleChecking to false', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any
      await service.stopStaleCheck()
      expect(service.staleChecking()).toBe(false)
    })
  })

  describe('stale check status mapping', () => {
    let completeHandler: (bookmark: PinboardItemVM, response: Response | null) => void
    const bookmark = makeBookmark({ hash: 'target' })

    beforeEach(async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([bookmark])
      await service.getAllBookmarks()

      mockStaleChecker.startWith.mockImplementation(
        async (_queue: unknown, _list: unknown, _start: unknown, handler: typeof completeHandler) => {
          completeHandler = handler
        }
      )
      await service.startStaleCheck()
    })

    it('sets status to "ok" for a successful response', () => {
      completeHandler(bookmark, { ok: true, status: 200 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('ok')
    })

    it('sets status to "stale" when response is null (invalid URL)', () => {
      completeHandler(bookmark, null)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('stale')
    })

    it('sets status to "stale" for 404', () => {
      completeHandler(bookmark, { ok: false, status: 404 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('stale')
    })

    it('sets status to "stale" for 301 (permanent redirect)', () => {
      completeHandler(bookmark, { ok: false, status: 301 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('stale')
    })

    it('sets status to "stale" for 308 (permanent redirect)', () => {
      completeHandler(bookmark, { ok: false, status: 308 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('stale')
    })

    it('sets status to "maybe-stale" for 401 (unauthorized)', () => {
      completeHandler(bookmark, { ok: false, status: 401 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('maybe-stale')
    })

    it('sets status to "maybe-stale" for 403 (forbidden)', () => {
      completeHandler(bookmark, { ok: false, status: 403 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('maybe-stale')
    })

    it('sets status to "maybe-stale" for 5xx server errors', () => {
      completeHandler(bookmark, { ok: false, status: 503 } as Response)
      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('maybe-stale')
    })
  })

  describe('startStaleCheck() with restart=true', () => {
    beforeEach(async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([
        makeBookmark({ hash: 'a', status: 'unchecked' }),
        makeBookmark({ hash: 'b', status: 'ok' }),
        makeBookmark({ hash: 'c', status: 'stale' }),
      ])
      await service.getAllBookmarks()
    })

    it('passes ALL bookmarks when restart=true, regardless of status', async () => {
      await service.startStaleCheck(true)

      const [, passedList] = mockStaleChecker.startWith.mock.calls[0]
      expect(passedList).toHaveLength(3)
    })

    it('passes only unchecked/checking bookmarks when restart=false (default)', async () => {
      await service.startStaleCheck(false)

      const [, passedList] = mockStaleChecker.startWith.mock.calls[0]
      expect(passedList).toHaveLength(1)
      expect(passedList[0].hash).toBe('a')
    })
  })

  describe('staleChecking signal during startStaleCheck()', () => {
    it('is true while stale checking is in progress', async () => {
      let resolveStartWith!: () => void
      mockStaleChecker.startWith.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveStartWith = resolve
          })
      )

      mockFacade.getAllBookmarks.mockResolvedValue([makeBookmark()])
      await service.getAllBookmarks()

      const promise = service.startStaleCheck()
      expect(service.staleChecking()).toBe(true)

      resolveStartWith()
      await promise
    })
  })

  describe('#handleStaleCheckStart', () => {
    it('marks the bookmark as "checking" when start handler is called', async () => {
      const bookmark = makeBookmark({ hash: 'target', status: 'unchecked' })
      mockFacade.getAllBookmarks.mockResolvedValue([bookmark])
      await service.getAllBookmarks()

      let startHandler!: (b: PinboardItemVM) => void
      mockStaleChecker.startWith.mockImplementation(async (_q: unknown, _l: unknown, handler: typeof startHandler) => {
        startHandler = handler
      })
      await service.startStaleCheck()
      startHandler(bookmark)

      expect(service.bookmarks().find((b) => b.hash === 'target')?.status).toBe('checking')
    })
  })

  describe('pauseStaleCheck() — local store', () => {
    it('persists current bookmarks to local store', async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([makeBookmark()])
      await service.getAllBookmarks()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any

      await service.pauseStaleCheck()

      expect(mockLocalStore.set).toHaveBeenCalledWith('bookmarks', service.bookmarks())
    })
  })

  describe('stopStaleCheck()', () => {
    it('sets queue to null after stopping', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any
      await service.stopStaleCheck()
      expect(service.queue).toBeNull()
    })

    it('persists current bookmarks to local store', async () => {
      mockFacade.getAllBookmarks.mockResolvedValue([makeBookmark()])
      await service.getAllBookmarks()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      service.queue = mockQueue as any

      await service.stopStaleCheck()

      expect(mockLocalStore.set).toHaveBeenCalledWith('bookmarks', service.bookmarks())
    })
  })
})

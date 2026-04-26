import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { StaleCheckerService } from './stale-checker-service'
import { ProgressBarService } from '../progress-bar/progress-bar-service'
import { PinboardItemVM } from '../../models/pinboard-view.model'

const mockFetch = vi.hoisted(() => vi.fn())

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: mockFetch,
}))

function makeBookmark(overrides: Partial<PinboardItemVM> = {}): PinboardItemVM {
  return {
    hash: 'abc123',
    href: 'https://example.com',
    description: 'Example',
    extended: '',
    meta: '',
    shared: 'no',
    tags: '',
    time: '2024-01-01',
    toread: 'no',
    tagsList: [],
    status: 'unchecked',
    ...overrides,
  }
}

describe('StaleCheckerService', () => {
  let service: StaleCheckerService
  let mockProgressBar: {
    start: ReturnType<typeof vi.fn>
    stop: ReturnType<typeof vi.fn>
    complete: ReturnType<typeof vi.fn>
    increment: ReturnType<typeof vi.fn>
    disable: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockProgressBar = {
      start: vi.fn(),
      stop: vi.fn(),
      complete: vi.fn(),
      increment: vi.fn(),
      disable: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [
        StaleCheckerService,
        { provide: ProgressBarService, useValue: mockProgressBar },
      ],
    })
    service = TestBed.inject(StaleCheckerService)
    mockFetch.mockReset()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('newQueue()', () => {
    it('returns a PQueue with default concurrency of 4', () => {
      const queue = service.newQueue()
      expect(queue.concurrency).toBe(4)
    })

    it('returns a PQueue with the specified concurrency', () => {
      const queue = service.newQueue({ concurrency: 2 })
      expect(queue.concurrency).toBe(2)
    })
  })

  describe('startWith()', () => {
    it('calls startHandler for each bookmark in the list', async () => {
      const bookmarks = [makeBookmark({ hash: 'a' }), makeBookmark({ hash: 'b', href: 'https://b.com' })]
      mockFetch.mockResolvedValue({ ok: true, status: 200 })

      const startHandler = vi.fn()
      const queue = service.newQueue()
      await service.startWith(queue, bookmarks, startHandler, vi.fn())

      expect(startHandler).toHaveBeenCalledTimes(2)
      expect(startHandler).toHaveBeenCalledWith(bookmarks[0])
      expect(startHandler).toHaveBeenCalledWith(bookmarks[1])
    })

    it('calls completeHandler with the bookmark and the HTTP response', async () => {
      const bookmark = makeBookmark()
      const fakeResponse = { ok: true, status: 200 }
      mockFetch.mockResolvedValue(fakeResponse)

      const completeHandler = vi.fn()
      const queue = service.newQueue()
      await service.startWith(queue, [bookmark], vi.fn(), completeHandler)

      expect(completeHandler).toHaveBeenCalledWith(bookmark, fakeResponse)
    })

    it('calls completeHandler with null when fetch throws', async () => {
      const bookmark = makeBookmark()
      mockFetch.mockRejectedValue(new Error('Network error'))

      const completeHandler = vi.fn()
      const queue = service.newQueue()
      await service.startWith(queue, [bookmark], vi.fn(), completeHandler)

      expect(completeHandler).toHaveBeenCalledWith(bookmark, null)
    })

    it('processes an empty list without calling any handlers', async () => {
      const startHandler = vi.fn()
      const completeHandler = vi.fn()
      const queue = service.newQueue()
      await service.startWith(queue, [], startHandler, completeHandler)

      expect(startHandler).not.toHaveBeenCalled()
      expect(completeHandler).not.toHaveBeenCalled()
    })

    it('fetches each bookmark href with a GET request', async () => {
      const bookmarks = [
        makeBookmark({ href: 'https://example.com' }),
        makeBookmark({ href: 'https://other.com', hash: 'def456' }),
      ]
      mockFetch.mockResolvedValue({ ok: true, status: 200 })

      const queue = service.newQueue()
      await service.startWith(queue, bookmarks, vi.fn(), vi.fn())

      expect(mockFetch).toHaveBeenCalledWith('https://example.com', { method: 'GET' })
      expect(mockFetch).toHaveBeenCalledWith('https://other.com', { method: 'GET' })
    })

    it('processes each bookmark independently — one failing does not skip others', async () => {
      const bookmarks = [
        makeBookmark({ hash: 'a', href: 'https://fails.com' }),
        makeBookmark({ hash: 'b', href: 'https://ok.com' }),
      ]
      mockFetch
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce({ ok: true, status: 200 })

      const completeHandler = vi.fn()
      const queue = service.newQueue()
      await service.startWith(queue, bookmarks, vi.fn(), completeHandler)

      expect(completeHandler).toHaveBeenCalledTimes(2)
    })
  })

  describe('progress bar', () => {
    it('starts the stale progress bar before processing', async () => {
      mockFetch.mockResolvedValue({ ok: true, status: 200 })
      const queue = service.newQueue()

      await service.startWith(queue, [makeBookmark()], vi.fn(), vi.fn())

      expect(mockProgressBar.start).toHaveBeenCalledWith('staleProgress', 0)
    })

    it('increments the progress bar once per bookmark', async () => {
      const bookmarks = [makeBookmark({ hash: 'a' }), makeBookmark({ hash: 'b' })]
      mockFetch.mockResolvedValue({ ok: true, status: 200 })
      const queue = service.newQueue()

      await service.startWith(queue, bookmarks, vi.fn(), vi.fn())

      expect(mockProgressBar.increment).toHaveBeenCalledTimes(2)
    })

    it('increments by 1/list.length for each bookmark', async () => {
      const bookmarks = [makeBookmark({ hash: 'a' }), makeBookmark({ hash: 'b' }), makeBookmark({ hash: 'c' })]
      mockFetch.mockResolvedValue({ ok: true, status: 200 })
      const queue = service.newQueue()

      await service.startWith(queue, bookmarks, vi.fn(), vi.fn())

      const expectedIncrement = 1 / 3
      expect(mockProgressBar.increment).toHaveBeenCalledWith('staleProgress', expectedIncrement)
    })

    it('stops the stale progress bar after all bookmarks are processed', async () => {
      mockFetch.mockResolvedValue({ ok: true, status: 200 })
      const queue = service.newQueue()

      await service.startWith(queue, [makeBookmark()], vi.fn(), vi.fn())

      expect(mockProgressBar.stop).toHaveBeenCalledWith('staleProgress')
    })

    it('stops the progress bar even when a bookmark fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('fail'))
      const queue = service.newQueue()

      await service.startWith(queue, [makeBookmark()], vi.fn(), vi.fn())

      expect(mockProgressBar.stop).toHaveBeenCalledWith('staleProgress')
    })
  })
})

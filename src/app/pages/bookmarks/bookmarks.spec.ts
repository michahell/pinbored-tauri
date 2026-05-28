import { ComponentFixture, TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { provideRouter } from '@angular/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Bookmarks from './bookmarks'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { provideAllIcons } from '@core/utils/provide-all-icons'

describe('Bookmarks', () => {
  let component: Bookmarks
  let fixture: ComponentFixture<Bookmarks>

  const bookmarksSignal = signal<PinboardItemVM[]>([])
  const bookmarksFetchingSignal = signal(false)
  const staleCheckingSignal = signal(false)
  const hasBookmarksSignal = signal(false)
  const queueLengthSignal = signal(0)
  const hasQueueSignal = signal(false)

  let mockBookmarksService: {
    bookmarks: typeof bookmarksSignal
    bookmarksFetching: typeof bookmarksFetchingSignal
    staleChecking: typeof staleCheckingSignal
    hasBookmarks: typeof hasBookmarksSignal
    queueLength: typeof queueLengthSignal
    hasQueue: typeof hasQueueSignal
    queue: null
    getAllBookmarks: ReturnType<typeof vi.fn>
    startStaleCheck: ReturnType<typeof vi.fn>
    pauseStaleCheck: ReturnType<typeof vi.fn>
    resumeStaleCheck: ReturnType<typeof vi.fn>
    stopStaleCheck: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    bookmarksSignal.set([])
    bookmarksFetchingSignal.set(false)
    staleCheckingSignal.set(false)
    hasBookmarksSignal.set(false)
    queueLengthSignal.set(0)
    hasQueueSignal.set(false)

    mockBookmarksService = {
      bookmarks: bookmarksSignal,
      bookmarksFetching: bookmarksFetchingSignal,
      staleChecking: staleCheckingSignal,
      hasBookmarks: hasBookmarksSignal,
      queueLength: queueLengthSignal,
      hasQueue: hasQueueSignal,
      queue: null,
      getAllBookmarks: vi.fn().mockResolvedValue(undefined),
      startStaleCheck: vi.fn().mockResolvedValue(undefined),
      pauseStaleCheck: vi.fn().mockResolvedValue(undefined),
      resumeStaleCheck: vi.fn().mockResolvedValue(undefined),
      stopStaleCheck: vi.fn().mockResolvedValue(undefined),
    }

    await TestBed.configureTestingModule({
      imports: [Bookmarks],
      providers: [provideAllIcons, provideRouter([]), { provide: BookmarksService, useValue: mockBookmarksService }],
    }).compileComponents()

    fixture = TestBed.createComponent(Bookmarks)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('startStaleCheckDisabled', () => {
    it('is true when there are no bookmarks', () => {
      hasBookmarksSignal.set(false)
      expect(component.startStaleCheckDisabled()).toBe(true)
    })

    it('is true when a queue already exists', () => {
      hasBookmarksSignal.set(true)
      hasQueueSignal.set(true)
      expect(component.startStaleCheckDisabled()).toBe(true)
    })

    it('is true while bookmarks are being fetched', () => {
      hasBookmarksSignal.set(true)
      bookmarksFetchingSignal.set(true)
      expect(component.startStaleCheckDisabled()).toBe(true)
    })

    it('is true while stale check is running', () => {
      hasBookmarksSignal.set(true)
      staleCheckingSignal.set(true)
      expect(component.startStaleCheckDisabled()).toBe(true)
    })

    it('is false when bookmarks are loaded and no active operation is running', () => {
      hasBookmarksSignal.set(true)
      hasQueueSignal.set(false)
      bookmarksFetchingSignal.set(false)
      staleCheckingSignal.set(false)
      expect(component.startStaleCheckDisabled()).toBe(false)
    })
  })

  describe('pauseStaleCheckDisabled', () => {
    it('is true when no queue exists', () => {
      hasQueueSignal.set(false)
      expect(component.pauseStaleCheckDisabled()).toBe(true)
    })

    it('is false when queue exists', () => {
      hasQueueSignal.set(true)
      expect(component.pauseStaleCheckDisabled()).toBe(false)
    })
  })

  describe('stopStaleCheckDisabled', () => {
    it('is true when no queue exists', () => {
      hasQueueSignal.set(false)
      expect(component.stopStaleCheckDisabled()).toBe(true)
    })

    it('is false when queue exists', () => {
      hasQueueSignal.set(true)
      expect(component.stopStaleCheckDisabled()).toBe(false)
    })
  })

  describe('getBookmarks()', () => {
    it('calls bookmarksService.getAllBookmarks()', async () => {
      await component.getBookmarks()
      expect(mockBookmarksService.getAllBookmarks).toHaveBeenCalled()
    })
  })

  describe('startStaleCheck()', () => {
    it('calls bookmarksService.startStaleCheck()', async () => {
      await component.startStaleCheck()
      expect(mockBookmarksService.startStaleCheck).toHaveBeenCalled()
    })
  })

  describe('stopStaleCheck()', () => {
    it('calls bookmarksService.stopStaleCheck()', async () => {
      await component.stopStaleCheck()
      expect(mockBookmarksService.stopStaleCheck).toHaveBeenCalled()
    })
  })

  describe('toggleStaleCheck()', () => {
    it('calls resumeStaleCheck() when queue is paused', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBookmarksService.queue = { isPaused: true } as any
      await component.toggleStaleCheck()
      expect(mockBookmarksService.resumeStaleCheck).toHaveBeenCalled()
    })

    it('calls pauseStaleCheck() when queue is not paused', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBookmarksService.queue = { isPaused: false } as any
      await component.toggleStaleCheck()
      expect(mockBookmarksService.pauseStaleCheck).toHaveBeenCalled()
    })
  })
})

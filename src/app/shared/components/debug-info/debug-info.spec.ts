import { ComponentFixture, TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { provideRouter } from '@angular/router'
import { describe, it, expect, beforeEach } from 'vitest'
import { DebugInfo } from './debug-info'
import { AuthenticationService } from '@auth/authentication-service'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { provideAllIcons } from '@core/utils/provide-all-icons'

describe('DebugInfo', () => {
  let component: DebugInfo
  let fixture: ComponentFixture<DebugInfo>
  let authStatusSignal: ReturnType<typeof signal<'checking' | 'unauthenticated' | 'authenticated'>>
  let bookmarksFetchingSignal: ReturnType<typeof signal<boolean>>
  let staleCheckingSignal: ReturnType<typeof signal<boolean>>
  let hasBookmarksSignal: ReturnType<typeof signal<boolean>>
  let queueLengthSignal: ReturnType<typeof signal<number>>
  let hasQueueSignal: ReturnType<typeof signal<boolean>>

  beforeEach(async () => {
    authStatusSignal = signal<'checking' | 'unauthenticated' | 'authenticated'>('unauthenticated')
    bookmarksFetchingSignal = signal(false)
    staleCheckingSignal = signal(false)
    hasBookmarksSignal = signal(false)
    queueLengthSignal = signal(0)
    hasQueueSignal = signal(false)

    await TestBed.configureTestingModule({
      imports: [DebugInfo],
      providers: [
        provideAllIcons,
        provideRouter([]),
        {
          provide: AuthenticationService,
          useValue: { authStatus: authStatusSignal },
        },
        {
          provide: BookmarksService,
          useValue: {
            bookmarksFetching: bookmarksFetchingSignal,
            staleChecking: staleCheckingSignal,
            hasBookmarks: hasBookmarksSignal,
            queueLength: queueLengthSignal,
            hasQueue: hasQueueSignal,
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DebugInfo)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('isLoggedIn', () => {
    it('is true when authStatus is "authenticated"', () => {
      authStatusSignal.set('authenticated')
      expect(component.isLoggedIn()).toBe(true)
    })

    it('is false when authStatus is "unauthenticated"', () => {
      authStatusSignal.set('unauthenticated')
      expect(component.isLoggedIn()).toBe(false)
    })

    it('is false when authStatus is "checking"', () => {
      authStatusSignal.set('checking')
      expect(component.isLoggedIn()).toBe(false)
    })
  })

  describe('bookmarksFetching', () => {
    it('is false by default', () => {
      expect(component.bookmarksFetching()).toBe(false)
    })

    it('reflects true when the service signal is true', () => {
      bookmarksFetchingSignal.set(true)
      expect(component.bookmarksFetching()).toBe(true)
    })
  })

  describe('staleChecking', () => {
    it('is false by default', () => {
      expect(component.staleChecking()).toBe(false)
    })

    it('reflects true when the service signal is true', () => {
      staleCheckingSignal.set(true)
      expect(component.staleChecking()).toBe(true)
    })
  })

  describe('hasBookmarks', () => {
    it('is false by default', () => {
      expect(component.hasBookmarks()).toBe(false)
    })

    it('reflects true when the service signal is true', () => {
      hasBookmarksSignal.set(true)
      expect(component.hasBookmarks()).toBe(true)
    })
  })

  describe('queueLength', () => {
    it('is 0 by default', () => {
      expect(component.queueLength()).toBe(0)
    })

    it('reflects the current queue size', () => {
      queueLengthSignal.set(42)
      expect(component.queueLength()).toBe(42)
    })
  })

  describe('queueExists', () => {
    it('is false by default', () => {
      expect(component.queueExists()).toBe(false)
    })

    it('reflects true when the service hasQueue signal is true', () => {
      hasQueueSignal.set(true)
      expect(component.queueExists()).toBe(true)
    })
  })
})

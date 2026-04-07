import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { interval } from '@signality/core'
import PQueue from 'p-queue'
import { PinboardItemVM, PinboardItemVMStatus } from '../../models/pinboard-view.model'
import { StaleCheckerService } from '../stale-checker/stale-checker-service'
import { PinboardFacade } from '../pinboard/pinboard-facade'

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  readonly #staleChecker = inject(StaleCheckerService)
  readonly #pinboardFacade = inject(PinboardFacade)

  // queue
  queue: PQueue | null = null

  // data signals
  readonly bookmarks = signal<PinboardItemVM[]>([])
  // status signals
  readonly bookmarksFetching = signal(false)
  readonly staleChecking = signal(false)
  readonly hasBookmarks = computed(() => this.bookmarks().length > 0)

  // for queue
  readonly hasQueue = signal(false)
  readonly queueLength = signal(0)
  readonly queueTasks = signal<
    | ReadonlyArray<{
        readonly id?: string
        readonly priority: number
        readonly startTime: number
        readonly timeout?: number
      }>
    | undefined
  >(undefined)

  // queue poller
  readonly poller = interval(() => {
    this.hasQueue.update(() => !!this.queue)
    this.queueLength.update(() => this.queue?.size ?? 0)
    this.queueTasks.update(() => this.queue?.runningTasks ?? undefined)
  }, 1000)

  constructor() {
    effect(() => {
      console.log('staleChecking: ', this.staleChecking())
    })
  }

  async getAllBookmarks(): Promise<void> {
    this.bookmarksFetching.set(true)
    await this.#pinboardFacade
      .getAllBookmarks()
      .then((bookmarks) => {
        if (bookmarks && bookmarks.length > 0) {
          this.bookmarks.set(bookmarks)
        }
      })
      .catch((err) => {
        this.bookmarks.set([])
        console.error('ERRORED!', err)
      })
      .finally(() => {
        this.bookmarksFetching.set(false)
      })
  }

  async startStaleCheck(): Promise<void> {
    try {
      this.queue = this.#staleChecker.newQueue()
      const uncheckedBookmarks = this.bookmarks().filter((bookmark) => bookmark.status === 'unchecked')
      this.staleChecking.update(() => true)
      await this.#staleChecker.startWith(
        this.queue,
        uncheckedBookmarks,
        this.#handleStaleCheckStart.bind(this),
        this.#handleStaleCheckComplete.bind(this)
      )
    } catch (error) {
      console.error(error)
      this.staleChecking.update(() => false)
    }
  }

  async pauseStaleCheck(): Promise<void> {
    this.queue?.pause()
    this.#updateBookmarksInLocalStore()
    this.staleChecking.update(() => false)
  }

  async resumeStaleCheck(): Promise<void> {
    if (this.queue?.isPaused) {
      this.queue?.start()
      this.#updateBookmarksInLocalStore()
      this.staleChecking.update(() => true)
    }
  }

  async stopStaleCheck(): Promise<void> {
    this.queue?.clear()
    this.staleChecking.update(() => false)
  }

  #handleStaleCheckStart(bookmark: PinboardItemVM): void {
    const bookmarks = this.bookmarks()
    const bookmarkInList = bookmarks.find((b) => b.hash === bookmark.hash)
    if (bookmarkInList) {
      bookmarkInList.status = 'checking'
      this.bookmarks.update(() => [...bookmarks])
    }
  }

  #handleStaleCheckComplete(bookmark: PinboardItemVM, response: Response | null): void {
    let status: PinboardItemVMStatus = 'unchecked'

    if (response == null) {
      console.info(`No Response -> invalid bookmark href -> stale`)
      status = 'stale'
    } else if (response?.ok) {
      status = 'ok'
    } else if (!response.ok) {
      console.log(`Response status: ${response.status} -> maybe-stale`)
      if (response.status === 301 || response.status === 308) {
        status = 'stale'
      } else if (response.status === 404) {
        status = 'stale'
      } else if (response.status === 401 || response.status === 403) {
        status = 'maybe-stale'
      } else if (response.status >= 500) {
        status = 'maybe-stale'
      }
    }

    const bookmarks = this.bookmarks()
    const bookmarkInList = bookmarks.find((b) => b.hash === bookmark.hash)
    if (bookmarkInList) {
      bookmarkInList.status = status
      this.bookmarks.set([...bookmarks])
    }
  }

  #updateBookmarksInLocalStore(): void {
    // update stored bookmarks in localStore
  }
}

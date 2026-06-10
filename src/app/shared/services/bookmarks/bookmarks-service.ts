import { computed, inject, Service, signal } from '@angular/core'
import { interval, IntervalRef } from '@signality/core'
import PQueue from 'p-queue'
import { StaleCheckerService, StaleStatus } from '@services/stale-checker'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'
import { BookmarkVM } from '@data-providers/abstract'
import { DataProviderFacade } from '@services/data-provider/data-provider-facade'
import { getChangeHash } from '@core/utils/bookmark-utils'

@Service()
export class BookmarksService {
  readonly #staleChecker = inject(StaleCheckerService)
  readonly facade = inject(DataProviderFacade)
  readonly #localStore = inject(TauriStoreService)

  // queue
  queue: PQueue | null = null

  // data signals
  readonly bookmarks = signal<BookmarkVM[]>([])
  // status signals
  readonly bookmarksFetching = signal(false)
  readonly staleChecking = signal(false)
  readonly hasBookmarks = computed(() => this.bookmarks().length > 0)

  // for queue
  #isPollingQueue = signal(false)
  // create queue poller (updates queue signals with 100ms interval)
  // eslint-disable-next-line no-unused-private-class-members
  #poller: IntervalRef = this.#createQueuePoller()
  readonly hasQueue = signal(false)
  readonly queueLength = signal(0)
  readonly queueTasks = signal<
    | readonly {
        readonly id?: string
        readonly priority: number
        readonly startTime: number
        readonly timeout?: number
      }[]
    | undefined
  >(undefined)

  async getAllBookmarks(via: 'cache' | 'server' = 'cache'): Promise<void> {
    this.bookmarksFetching.set(true)
    await this.facade
      .getAllBookmarks(via)
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
        console.log('finally : bookmarks fetched!')
        this.bookmarksFetching.set(false)
      })
  }

  async checkSingleBookmark(bookmark: BookmarkVM): Promise<void> {
    try {
      this.staleChecking.set(true)
      const queue = this.#staleChecker.newQueue({ concurrency: 1 })
      await this.#staleChecker.startWith(
        queue,
        [bookmark],
        this.#handleStaleCheckStart.bind(this),
        this.#handleStaleCheckComplete.bind(this)
      )
    } catch (error) {
      console.error(error)
    } finally {
      this.staleChecking.set(false)
    }
  }

  async startStaleCheck(restart = false): Promise<void> {
    try {
      this.queue = this.#staleChecker.newQueue()
      const uncheckedBookmarks = this.bookmarks().filter(
        (bookmark) => bookmark.status === 'unchecked' || bookmark.status === 'checking'
      )
      // start stale checking
      this.staleChecking.update(() => true)
      // start queue polling
      this.#isPollingQueue.update(() => true)
      // start stale-check
      await this.#staleChecker.startWith(
        this.queue,
        restart ? this.bookmarks() : uncheckedBookmarks,
        this.#handleStaleCheckStart.bind(this),
        this.#handleStaleCheckComplete.bind(this)
      )
    } catch (error) {
      console.error(error)
      this.#stopStaleChecking()
    }
  }

  async pauseStaleCheck(): Promise<void> {
    this.queue?.pause()
    await this.#updateBookmarksInLocalStore()
    this.#stopStaleChecking()
  }

  async resumeStaleCheck(): Promise<void> {
    if (this.queue?.isPaused) {
      this.queue?.start()
      this.staleChecking.update(() => true)
    }
  }

  async stopStaleCheck(): Promise<void> {
    this.queue?.clear()
    this.queue = null
    await this.#updateBookmarksInLocalStore()
    this.#stopStaleChecking()
  }

  #handleStaleCheckStart(bookmark: BookmarkVM): void {
    const bookmarks = this.bookmarks()
    const bookmarkInList = bookmarks.find((b) => b.hash === bookmark.hash)
    if (bookmarkInList) {
      bookmarkInList.status = 'checking'
      bookmarkInList.changeHash = getChangeHash()
      this.bookmarks.update(() => [...bookmarks])
    }
  }

  #handleStaleCheckComplete(bookmark: BookmarkVM, response: Response | null): void {
    let status: StaleStatus = 'unchecked'

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
      bookmarkInList.changeHash = getChangeHash()
      this.bookmarks.set([...bookmarks])
    }
  }

  async #updateBookmarksInLocalStore(): Promise<void> {
    await this.#localStore.set('bookmarks', this.bookmarks())
  }

  #createQueuePoller(): IntervalRef {
    return interval(() => {
      if (!this.#isPollingQueue()) {
        return
      }
      console.log('resuming queue polling...')
      if (!this.queue?.isPaused && this.queue ? this.queue.size > 0 : false) {
        this.hasQueue.update(() => !!this.queue)
        this.queueLength.update(() => this.queue?.size ?? 0)
        this.queueTasks.update(() => this.queue?.runningTasks ?? undefined)
      }
    }, 100)
  }

  #stopStaleChecking(): void {
    console.log('stopping stale checking...')
    this.staleChecking.update(() => false)
    console.log('stopping queue polling...')
    this.#isPollingQueue.update(() => false)
  }
}

import { computed, inject, Service, Signal, signal } from '@angular/core'
import { interval, IntervalRef } from '@signality/core'
import PQueue from 'p-queue'
import { StaleCheckerService } from '@services/stale-checker/stale-checker-service'
import { StaleStatus } from '@services/stale-checker/stale-checker.model'
import { BookmarkVM } from '@data-providers/abstract'
import { DataProviderFacade } from '@services/data-provider/data-provider-facade'
import { getChangeHash } from '@core/utils/bookmark-utils'
import { SignalStore } from '@services/signal-store'
import { Immutable } from 'signalstory'

@Service()
export class BookmarksService {
  readonly #staleChecker = inject(StaleCheckerService)
  readonly #dataProvider = inject(DataProviderFacade)
  readonly #signalStore = inject(SignalStore)

  // queue
  queue: PQueue | null = null

  // signal store signals
  readonly bookmarks: Signal<Immutable<BookmarkVM[]>> = computed(() => this.#signalStore.bookmarks())
  readonly hasBookmarks = computed(() => this.#signalStore.hasBookmarks())
  // status signals
  readonly bookmarksFetching = signal(false)
  readonly staleChecking = signal(false)

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
    await this.#dataProvider
      .getAllBookmarks(via)
      .then((bookmarks) => {
        if (bookmarks && bookmarks.length > 0) {
          this.#signalStore.setBookmarks(bookmarks)
        }
      })
      .catch((err) => {
        this.#signalStore.setBookmarks([])
        console.error('ERRORED!', err)
      })
      .finally(() => {
        this.bookmarksFetching.set(false)
      })
  }

  async checkSingleBookmark(bookmark: Immutable<BookmarkVM>): Promise<void> {
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
      const unprocessedBookmarks: Immutable<BookmarkVM>[] = this.bookmarks().filter(
        (bookmark) => bookmark.status === 'unchecked' || bookmark.status === 'checking'
      )
      // start stale checking
      this.staleChecking.update(() => true)
      // start queue polling
      this.#isPollingQueue.update(() => true)
      // start stale-check
      await this.#staleChecker.startWith(
        this.queue,
        restart ? this.bookmarks() : unprocessedBookmarks,
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
    this.#stopStaleChecking()
  }

  #handleStaleCheckStart(bookmark: Immutable<BookmarkVM>): void {
    this.#signalStore.mutateBookmark({
      ...bookmark,
      status: 'checking',
      changeHash: getChangeHash(),
    })
  }

  #handleStaleCheckComplete(bookmark: Immutable<BookmarkVM>, response: Response | null): void {
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

    this.#signalStore.mutateBookmark({
      ...bookmark,
      status,
      changeHash: getChangeHash(),
    })
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

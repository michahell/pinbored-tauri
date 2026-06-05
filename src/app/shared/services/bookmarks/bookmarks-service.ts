import { computed, inject, Service, signal } from '@angular/core'
import PQueue from 'p-queue'
import { StaleCheckerService } from '@services/stale-checker/stale-checker-service'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'
import { BookmarkVM } from '@data-providers/abstract'
import { StaleStatus } from '@services/stale-checker/stale-checker.model'
import { DataProviderFacade } from '@services/data-provider/data-provider-facade'

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
  // #pollQueue = signal<boolean>(false)
  // #poller: IntervalRef = interval(() => {
  //   if (!this.queue?.isPaused && this.queue ? this.queue.size > 0 : false) {
  //     this.hasQueue.update(() => !!this.queue)
  //     this.queueLength.update(() => this.queue?.size ?? 0)
  //     this.queueTasks.update(() => this.queue?.runningTasks ?? undefined)
  //   }
  // }, 100)
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

  async startStaleCheck(restart = false): Promise<void> {
    try {
      this.queue = this.#staleChecker.newQueue()
      const uncheckedBookmarks = this.bookmarks().filter(
        (bookmark) => bookmark.status === 'unchecked' || bookmark.status === 'checking'
      )
      // start stale checking
      this.staleChecking.update(() => true)
      await this.#staleChecker.startWith(
        this.queue,
        restart ? this.bookmarks() : uncheckedBookmarks,
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
    await this.#updateBookmarksInLocalStore()
    this.staleChecking.update(() => false)
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
    this.staleChecking.update(() => false)
  }

  #handleStaleCheckStart(bookmark: BookmarkVM): void {
    const bookmarks = this.bookmarks()
    const bookmarkInList = bookmarks.find((b) => b.hash === bookmark.hash)
    if (bookmarkInList) {
      bookmarkInList.status = 'checking'
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
      this.bookmarks.set([...bookmarks])
    }
  }

  async #updateBookmarksInLocalStore(): Promise<void> {
    await this.#localStore.set('bookmarks', this.bookmarks())
  }
}

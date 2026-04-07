import { computed, inject, Injectable, signal } from '@angular/core'
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
  readonly bookmarks = signal<Map<string, PinboardItemVM>>(new Map())
  // status signals
  readonly bookmarksFetching = signal(false)
  readonly staleChecking = signal(false)
  readonly hasBookmarks = computed(() => this.bookmarks().size > 0)

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

  async getAllBookmarks(): Promise<void> {
    this.bookmarksFetching.set(true)
    await this.#pinboardFacade
      .getAllBookmarks()
      .then((bookmarks) => {
        if (bookmarks && bookmarks.length > 0) {
          this.bookmarks.set(new Map(bookmarks.map((bm) => [bm.hash, bm])))
        }
      })
      .catch((err) => {
        this.bookmarks.set(new Map())
        console.error('ERRORED!', err)
      })
      .finally(() => {
        this.bookmarksFetching.set(false)
      })
  }

  async startStaleCheck(): Promise<void> {
    try {
      this.queue = this.#staleChecker.newQueue()
      await this.#staleChecker.startWith(
        this.queue,
        this.bookmarks(),
        this.#handleStaleCheckStart.bind(this),
        this.#handleStaleCheckComplete.bind(this)
      )
      this.staleChecking.set(true)
    } catch (error) {
      console.error(error)
      this.staleChecking.set(false)
    }
  }

  async pauseStaleCheck(): Promise<void> {
    this.queue?.pause()
    this.staleChecking.set(false)
  }

  async resumeStaleCheck(): Promise<void> {
    if (this.queue?.isPaused) {
      this.queue?.start()
      this.staleChecking.set(true)
    }
  }

  async stopStaleCheck(): Promise<void> {
    this.queue?.clear()
    this.staleChecking.set(false)
  }

  #handleStaleCheckStart(list: Map<string, PinboardItemVM>, bookmark: PinboardItemVM): void {
    list.set(bookmark.hash, {
      ...bookmark,
      status: 'checking',
    })
  }

  #handleStaleCheckComplete(
    list: Map<string, PinboardItemVM>,
    bookmark: PinboardItemVM,
    response: Response | null
  ): void {
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

    list.set(bookmark.hash, {
      ...bookmark,
      status,
    })

    console.log('updated bookmark: ', list.get(bookmark.hash))
    // update bookmarks signal
    this.bookmarks.update(() => list)
  }
}

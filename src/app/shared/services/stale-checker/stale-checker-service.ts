import { inject, Service } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import PQueue from 'p-queue'
import { pMapIterable } from 'p-map'
import { STALE_CHECKER_DEFAULT_CONCURRENCY } from '@core/constants/app-constants'
import { BookmarkVM } from '../../data-providers/abstract/models/abstract-view.model'
import { ProgressBarService } from '@services/progress-bar/progress-bar-service'

export type PinboardStaleCheckStartHandler = (item: BookmarkVM) => void
export type PinboardStaleCheckCompleteHandler = (item: BookmarkVM, result: Response | null) => void

@Service()
export class StaleCheckerService {
  readonly #progressBarService = inject(ProgressBarService)

  newQueue(pQueueOptions = { concurrency: STALE_CHECKER_DEFAULT_CONCURRENCY }): PQueue {
    return new PQueue(pQueueOptions)
  }

  async startWith(
    queue: PQueue,
    list: BookmarkVM[],
    startHandler: PinboardStaleCheckStartHandler,
    completeHandler: PinboardStaleCheckCompleteHandler
  ): Promise<void> {
    queue.onEmpty().then(() => this.#queueEmpty())
    queue.onIdle().then(() => this.#queueIdle())
    queue.onError().then(() => this.#queueError())
    // setup progress bar
    this.#progressBarService.start('staleProgress', 0)
    const incrementAmount = 1 / list.length
    // start queue
    for await (const [pinboardItem, response] of pMapIterable(list, (bookmark) =>
      queue.add(() => {
        // console.log('adding to queue: ', bookmark.hash)
        startHandler(bookmark)
        this.#progressBarService.increment('staleProgress', incrementAmount)
        return this.#fetchBookmark(bookmark)
      })
    )) {
      completeHandler(pinboardItem, response)
    }
    // when done
    this.#progressBarService.stop('staleProgress')
  }

  async #fetchBookmark(pinboardItem: BookmarkVM): Promise<[BookmarkVM, Response | null]> {
    let result: [BookmarkVM, Response | null]
    try {
      result = await fetch(pinboardItem.href, {
        method: 'GET',
      }).then((response) => [pinboardItem, response])
    } catch (error) {
      console.error(error)
      result = [pinboardItem, null]
    }
    return result
  }

  #queueEmpty(): void {
    console.log('queue is empty!')
  }

  #queueIdle() {
    console.log('queue is idle!')
  }

  #queueError() {
    console.error('queue errored!')
  }
}

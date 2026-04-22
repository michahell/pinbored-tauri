import { inject, Injectable } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import PQueue from 'p-queue'
import { pMapIterable } from 'p-map'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { ProgressBarService } from '../progress-bar/progress-bar-service'

export type PinboardStaleCheckStartHandler = (item: PinboardItemVM) => void
export type PinboardStaleCheckCompleteHandler = (item: PinboardItemVM, result: Response | null) => void

@Injectable({
  providedIn: 'root',
})
export class StaleCheckerService {
  readonly #progressBarService = inject(ProgressBarService)

  newQueue(pQueueOptions = { concurrency: 4 }): PQueue {
    return new PQueue(pQueueOptions)
  }

  async startWith(
    queue: PQueue,
    list: PinboardItemVM[],
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

  async #fetchBookmark(pinboardItem: PinboardItemVM): Promise<[PinboardItemVM, Response | null]> {
    let result: [PinboardItemVM, Response | null]
    try {
      result = await fetch(pinboardItem.href, {
        method: 'GET',
      }).then((response) => [pinboardItem, response])
    } catch (error) {
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

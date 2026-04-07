import { Injectable } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import PQueue from 'p-queue'
import { pMapIterable } from 'p-map'
import { PinboardItemVM } from '../../models/pinboard-view.model'

export type PinboardStaleCheckUpdateHandler = (item: PinboardItemVM, result: Response | null) => void

@Injectable({
  providedIn: 'root',
})
export class StaleCheckerService {
  newQueue(pQueueOptions = { concurrency: 4 }): PQueue {
    return new PQueue(pQueueOptions)
  }

  async startWith(
    queue: PQueue,
    list: Map<string, PinboardItemVM>,
    handler: PinboardStaleCheckUpdateHandler
  ): Promise<void> {
    queue.onEmpty().then(() => this.#queueEmpty())
    queue.onIdle().then(() => this.#queueIdle())
    queue.onError().then(() => this.#queueError())
    // start queue
    for await (const [pinboardItem, response] of pMapIterable(
      list,
      ([_, bookmark]) =>
        queue.add(() => {
          this.#markAsChecking(bookmark, list)
          return this.#fetchBookmark(bookmark)
        }) // { priority: item.priority }
    )) {
      handler(pinboardItem, response)
    }
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

  #markAsChecking(bookmark: PinboardItemVM, list: Map<string, PinboardItemVM>): void {
    list.set(bookmark.hash, {
      ...bookmark,
      status: 'checking',
    })
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

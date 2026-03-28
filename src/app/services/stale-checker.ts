import { Injectable } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import PQueue from 'p-queue'
import { pMapIterable } from 'p-map'

export interface MockPinboardItem {
  url: string
  id: string
}

export interface PinboardQueue {
  startWith: (
    urlList: MockPinboardItem[],
    updateHandler: PinboardStaleCheckUpdateHandler
  ) => Promise<void>
}

export type PinboardStaleCheckUpdateHandler = (
  item: MockPinboardItem,
  result: Response
) => Promise<void>

@Injectable({
  providedIn: 'root',
})
export class StaleChecker {
  newQueue(): PinboardQueue {
    const queue = new PQueue({ concurrency: 4 })
    return {
      startWith: (
        list: MockPinboardItem[],
        updateHandler: PinboardStaleCheckUpdateHandler
      ) => this.#startWith(queue, list, updateHandler),
    }
  }

  async #startWith(
    queue: PQueue,
    list: MockPinboardItem[],
    handler: PinboardStaleCheckUpdateHandler
  ): Promise<any> {
    for await (const [pinboardItem, response] of pMapIterable(
      list,
      (item) => queue.add(() => this.#fetchBookmark(item)) // { priority: item.priority }
    )) {
      await handler(pinboardItem, response)
    }
  }

  async #fetchBookmark(
    pinboardItem: MockPinboardItem
  ): Promise<[MockPinboardItem, Response]> {
    // Send a GET request
    return await fetch(pinboardItem.url, {
      method: 'GET',
    }).then((response) => [pinboardItem, response])
  }
}

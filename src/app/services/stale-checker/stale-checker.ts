import { Injectable } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import PQueue from 'p-queue'
import { pMapIterable } from 'p-map'
import { PinboardItemVM } from '../../models/pinboard-view.model'

export interface PinboardQueue {
  startWith: (
    list: Map<string, PinboardItemVM>,
    updateHandler: PinboardStaleCheckUpdateHandler
  ) => Promise<void>
}

export type PinboardStaleCheckUpdateHandler = (
  item: PinboardItemVM,
  result: Response | null
) => Promise<void>

@Injectable({
  providedIn: 'root',
})
export class StaleChecker {
  newQueue(): PinboardQueue {
    const queue = new PQueue({ concurrency: 4 })
    return {
      startWith: (
        list: Map<string, PinboardItemVM>,
        updateHandler: PinboardStaleCheckUpdateHandler
      ) => this.#startWith(queue, list, updateHandler),
    }
  }

  async #startWith(
    queue: PQueue,
    list: Map<string, PinboardItemVM>,
    handler: PinboardStaleCheckUpdateHandler
  ): Promise<any> {
    for await (const [pinboardItem, response] of pMapIterable(
      list,
      ([_, bookmark]) =>
        queue.add(() => {
          this.#markAsChecking(bookmark, list)
          return this.#fetchBookmark(bookmark)
        }) // { priority: item.priority }
    )) {
      await handler(pinboardItem, response)
    }
  }

  async #fetchBookmark(
    pinboardItem: PinboardItemVM
  ): Promise<[PinboardItemVM, Response | null]> {
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

  #markAsChecking(
    bookmark: PinboardItemVM,
    list: Map<string, PinboardItemVM>
  ): void {
    list.set(bookmark.hash, {
      ...bookmark,
      status: 'checking',
    })
  }
}

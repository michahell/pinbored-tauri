import { Component, computed, inject, signal } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { PinboardFacade } from '../../services/pinboard/pinboard-facade'
import {
  PinboardItemVM,
  PinboardItemVMStatus,
} from '../../models/pinboard-view.model'
import { BookmarksTable } from '../../components/bookmarks-table/bookmarks-table'
import { HlmTabsImports } from '@spartan-ng/helm/tabs'
import { StaleTable } from '../../components/stale-table/stale-table'
import { StaleChecker } from '../../services/stale-checker/stale-checker'

@Component({
  selector: 'app-bookmarks',
  imports: [HlmButton, HlmSpinner, BookmarksTable, HlmTabsImports, StaleTable],
  templateUrl: './bookmarks.html',
})
export default class Bookmarks {
  bookmarks = signal<Map<string, PinboardItemVM>>(new Map())
  staleCheckedBookmarks = signal<Map<string, PinboardItemVM>>(new Map())
  bookmarksFetching = signal(false)
  hasBookmarks = computed(() => this.bookmarks().size > 0)

  readonly #staleChecker = inject(StaleChecker)
  readonly #pinboardFacade = inject(PinboardFacade)

  async getBookmarks(): Promise<void> {
    this.bookmarksFetching.set(true)
    const bookmarks: PinboardItemVM[] | void = await this.#pinboardFacade
      .getAllBookmarks()
      .catch((err) => {
        this.bookmarks.set(new Map())
        this.staleCheckedBookmarks.set(new Map())
        this.bookmarksFetching.set(false)
        console.error('ERRORED!', err)
      })

    // console.log('bookmarks returned: ', bookmarks)
    if (bookmarks && bookmarks.length > 0) {
      this.bookmarks.set(new Map(bookmarks.map((bm) => [bm.hash, bm])))
      this.staleCheckedBookmarks.set(new Map())
      this.bookmarksFetching.set(false)
    }
  }

  async staleCheck(): Promise<void> {
    try {
      await this.#staleChecker
        .newQueue()
        .startWith(this.bookmarks(), this.#handleStaleCheckerUpdate.bind(this))
    } catch (error) {
      console.error(error)
    }
  }

  #handleStaleCheckerUpdate(
    bookmark: PinboardItemVM,
    response: Response | null
  ): Promise<void> {
    // console.log('stale checker update method called for item: ', bookmark)
    // console.log('response: ', response)

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

    // update bookmark item
    const updatedBookmark = this.#updateStaleStatus(bookmark, status)
    console.log('updated bookmark: ', updatedBookmark)

    // update lists
    const map = this.bookmarks()
    this.bookmarks.set(map.set(bookmark.hash, updatedBookmark))
    const staleMap = this.staleCheckedBookmarks()
    this.staleCheckedBookmarks.set(map.set(bookmark.hash, updatedBookmark))

    return Promise.resolve()
  }

  #updateStaleStatus(
    bookmark: PinboardItemVM,
    status: PinboardItemVMStatus
  ): PinboardItemVM {
    return {
      ...bookmark,
      status,
    }
  }
}

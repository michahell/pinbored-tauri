import { Component, computed, inject } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { BookmarksTable } from '../../components/bookmarks-table/bookmarks-table'
import { BookmarksService } from '../../services/bookmarks/bookmarks-service'

@Component({
  selector: 'app-bookmarks',
  imports: [HlmButton, HlmSpinner, HlmButtonGroupImports, HlmBadgeImports, BookmarksTable],
  templateUrl: './bookmarks.html',
})
export default class Bookmarks {
  readonly #bookmarks = inject(BookmarksService)

  // data signals
  readonly bookmarks = this.#bookmarks.bookmarks
  // status signals
  readonly bookmarksFetching = this.#bookmarks.bookmarksFetching
  readonly staleChecking = this.#bookmarks.staleChecking
  readonly hasBookmarks = this.#bookmarks.hasBookmarks
  // for queue
  readonly queueLength = this.#bookmarks.queueLength
  // flag signals
  readonly staleCheckDisabled = computed(() => !this.hasBookmarks() || this.bookmarksFetching() || this.staleChecking())

  async getBookmarks(): Promise<void> {
    console.info('getting all bookmarks...')
    await this.#bookmarks.getAllBookmarks()
  }

  async staleCheck(): Promise<void> {
    console.info('starting stale checking...')
    await this.#bookmarks.staleCheck()
  }
}

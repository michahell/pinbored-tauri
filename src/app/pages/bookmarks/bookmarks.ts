import { Component, computed, inject } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { hlmH4, hlmMuted } from '@spartan-ng/helm/typography'
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
  readonly hlmMuted = hlmMuted
  readonly hlmH4 = hlmH4
  readonly #bookmarks = inject(BookmarksService)

  // data signals
  readonly bookmarks = computed(() => this.#bookmarks.bookmarks())
  // status signals
  readonly bookmarksFetching = computed(() => this.#bookmarks.bookmarksFetching())
  readonly staleChecking = computed(() => this.#bookmarks.staleChecking())
  readonly hasBookmarks = computed(() => this.#bookmarks.hasBookmarks)
  // for queue
  readonly queueLength = computed(() => this.#bookmarks.queueLength())
  readonly queueExists = computed(() => this.#bookmarks.hasQueue())
  // flag signals
  readonly startStaleCheckDisabled = computed(
    () => this.queueExists() || !this.hasBookmarks() || this.bookmarksFetching() || this.staleChecking()
  )
  readonly pauseStaleCheckDisabled = computed(() => !this.queueExists())
  readonly stopStaleCheckDisabled = computed(() => !this.queueExists())

  async getBookmarks(): Promise<void> {
    console.info('getting all bookmarks...')
    await this.#bookmarks.getAllBookmarks()
  }

  async startStaleCheck(): Promise<void> {
    console.info('starting stale checking...')
    await this.#bookmarks.startStaleCheck()
  }

  async toggleStaleCheck(): Promise<void> {
    if (this.#bookmarks.queue?.isPaused) {
      await this.#bookmarks.startStaleCheck()
      console.info('restarting stale checking...')
    } else {
      await this.#bookmarks.pauseStaleCheck()
      console.info('pausing stale checking...')
    }
  }

  async stopStaleCheck(): Promise<void> {
    console.info('stopping stale checking...')
    await this.#bookmarks.stopStaleCheck()
  }
}

import { Component, computed, inject, OnInit } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { hlmMuted } from '@spartan-ng/helm/typography'
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { BookmarksTable } from '../../components/bookmarks-table/bookmarks-table'
import { BookmarksService } from '../../services/bookmarks/bookmarks-service'
import { NgTemplateOutlet } from '@angular/common'
import { MainLayout } from '../../layouts/main-layout/main-layout'

@Component({
  selector: 'app-bookmarks',
  imports: [HlmButton, HlmSpinner, HlmButtonGroupImports, BookmarksTable, NgTemplateOutlet, MainLayout],
  templateUrl: './bookmarks.html',
})
export default class Bookmarks implements OnInit {
  readonly hlmMuted = hlmMuted

  readonly #bookmarks = inject(BookmarksService)

  // data signals
  readonly bookmarks = computed(() => this.#bookmarks.bookmarks())
  // status signals
  readonly bookmarksFetching = computed(() => this.#bookmarks.bookmarksFetching())
  readonly staleChecking = computed(() => this.#bookmarks.staleChecking())
  readonly hasBookmarks = computed(() => this.#bookmarks.hasBookmarks())
  // for queue
  readonly queueExists = computed(() => this.#bookmarks.hasQueue())
  // flag signals
  readonly startStaleCheckDisabled = computed(
    () => this.queueExists() || !this.hasBookmarks() || this.bookmarksFetching() || this.staleChecking()
  )
  readonly pauseStaleCheckDisabled = computed(() => !this.queueExists())
  readonly stopStaleCheckDisabled = computed(() => !this.queueExists())

  async ngOnInit(): Promise<void> {
    await this.getBookmarks()
  }

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
      await this.#bookmarks.resumeStaleCheck()
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

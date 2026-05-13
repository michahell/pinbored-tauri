import { Component, signal, computed, inject, OnInit } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { hlmMuted } from '@spartan-ng/helm/typography'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { MainLayout } from '../../shared/components/layouts/main-layout/main-layout'
import { BookmarksTable } from '@components/bookmarks-table/bookmarks-table'
import { BookmarksService } from './bookmarks-service'

type BookmarkQuickFilter = 'all' | 'private' | 'public' | 'read' | 'unread'

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
  readonly currentFilter = signal<BookmarkQuickFilter>('all')

  async ngOnInit(): Promise<void> {
    await this.getBookmarks()
  }

  async getBookmarks(): Promise<void> {
    await this.#bookmarks.getAllBookmarks()
  }

  async startStaleCheck(): Promise<void> {
    await this.#bookmarks.startStaleCheck()
  }

  async toggleStaleCheck(): Promise<void> {
    if (this.#bookmarks.queue?.isPaused) {
      await this.#bookmarks.resumeStaleCheck()
    } else {
      await this.#bookmarks.pauseStaleCheck()
    }
  }

  async stopStaleCheck(): Promise<void> {
    await this.#bookmarks.stopStaleCheck()
  }

  filter(filterType: string): void {
    this.currentFilter.set(filterType as BookmarkQuickFilter)
  }
}

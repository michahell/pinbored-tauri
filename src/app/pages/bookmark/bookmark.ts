import { Component, computed, inject, OnInit } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { BookmarksService } from '../bookmarks/bookmarks-service'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { ActivatedRoute, Params, RouterLink } from '@angular/router'
import { skyBadge } from '@styles/badge-colors'
import { HlmButton } from '@spartan-ng/helm/button'
import { hlmMuted } from '@spartan-ng/helm/typography'

@Component({
  selector: 'app-bookmark',
  imports: [MainLayout, HlmBadge, HlmButton, RouterLink],
  templateUrl: './bookmark.html',
})
export default class Bookmark implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute)
  readonly #bookmarksService = inject(BookmarksService)

  protected readonly skyBadge = skyBadge

  readonly #params = toSignal<Params | undefined>(this.#activatedRoute.params)
  readonly #requestedBookmark = computed<string | null>(() => this.#params()?.['bookmark'])
  readonly #bookmarks = computed<PinboardItemVM[]>(() => this.#bookmarksService.bookmarks())

  bookmark = computed<PinboardItemVM | null>(() => {
    return this.#bookmarks().find((bookmark) => this.#requestedBookmark() == bookmark.hash) ?? null
  })

  async ngOnInit(): Promise<void> {
    await this.getBookmarks()
  }

  async getBookmarks(): Promise<void> {
    await this.#bookmarksService.getAllBookmarks()
  }

  protected readonly hlmMuted = hlmMuted
}

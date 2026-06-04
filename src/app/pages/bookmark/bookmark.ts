import { Component, computed, effect, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core'
import { ActivatedRoute, Params, RouterLink } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { HlmButton } from '@spartan-ng/helm/button'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { PinboardSuggestResult } from '@models/pinboard.model'
import { skyBadge } from '@styles/badge-colors'
import { TagsService } from '@services/tags/tags-service'

@Component({
  selector: 'app-bookmark',
  imports: [MainLayout, HlmBadge, HlmButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './bookmark.html',
})
export default class Bookmark implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute)
  readonly #bookmarksService = inject(BookmarksService)
  readonly #tagsService = inject(TagsService)

  protected readonly skyBadge = skyBadge

  readonly #params = toSignal<Params>(this.#activatedRoute.params)
  readonly #requestedBookmark = computed<string>(() => this.#params()!['bookmark'])
  readonly #bookmarks = computed<PinboardItemVM[]>(() => this.#bookmarksService.bookmarks())
  readonly bookmark = computed<PinboardItemVM>(() => {
    return this.#bookmarks().find((bookmark) => this.#requestedBookmark() == bookmark.hash)!
  })

  readonly suggestedTags = signal<string[]>([])

  readonly getSuggestedTags = effect(() => {
    const bm = this.bookmark()
    if (bm && bm.tags.length === 0) {
      console.log('effect running #getTagSuggestionsForBookmark...')
      this.#getTagSuggestionsForBookmark(bm)
    }
  })

  async ngOnInit(): Promise<void> {
    await this.getBookmarks()
  }

  async getBookmarks(): Promise<void> {
    await this.#bookmarksService.getAllBookmarks()
  }

  #getTagSuggestionsForBookmark(pinboardItemVM: PinboardItemVM): Promise<PinboardSuggestResult> {
    return this.#tagsService.suggestTagsForUrl(pinboardItemVM.href)
  }
}

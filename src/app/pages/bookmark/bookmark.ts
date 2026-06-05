import { Component, computed, effect, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, Params, RouterLink } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { HlmButton } from '@spartan-ng/helm/button'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { TagsService } from '@services/tags/tags-service'
import { skyBadge } from '@styles/badge-colors'
import { BookmarkVM, SuggestTagsResult } from '@data-providers/abstract'
import { SuggestTagsResultVM } from '@data-providers/abstract/models/abstract-view.model'

@Component({
  selector: 'app-bookmark',
  imports: [MainLayout, HlmBadge, HlmButton, RouterLink],
  templateUrl: './bookmark.html',
})
export default class Bookmark implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute)
  readonly #bookmarksService = inject(BookmarksService)
  readonly #tagsService = inject(TagsService)

  protected readonly skyBadge = skyBadge

  readonly #params = toSignal<Params>(this.#activatedRoute.params)
  readonly #requestedBookmark = computed<string>(() => this.#params()!['bookmark'])
  readonly #bookmarks = computed<BookmarkVM[]>(() => this.#bookmarksService.bookmarks())
  readonly bookmark = computed<BookmarkVM>(() => {
    return this.#bookmarks().find((bookmark) => this.#requestedBookmark() == bookmark.hash)!
  })

  readonly suggestedTags = signal<SuggestTagsResultVM | null>(null)

  readonly getSuggestedTags = effect(async () => {
    const bm = this.bookmark()
    if (bm && bm.tags.length === 0) {
      const suggestions = await this.#getTagSuggestionsForBookmark(bm)
      this.suggestedTags.set(suggestions)
      console.log('effect ran #getTagSuggestionsForBookmark: ', suggestions)
    }
  })

  async ngOnInit(): Promise<void> {
    await this.getBookmarks()
  }

  async getBookmarks(): Promise<void> {
    await this.#bookmarksService.getAllBookmarks()
  }

  #getTagSuggestionsForBookmark(pinboardItemVM: BookmarkVM): Promise<SuggestTagsResultVM> {
    return this.#tagsService.suggestTagsForUrl(pinboardItemVM.href)
  }
}

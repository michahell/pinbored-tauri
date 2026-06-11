import { Component, computed, inject, OnInit, Signal } from '@angular/core'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { BigTag } from '@components/big-tag/big-tag'
import { ActivatedRoute, Params } from '@angular/router'
import { TagsService } from '@services/tags/tags-service'
import { BookmarkVM, TagVM } from '@data-providers/abstract'
import { BookmarksTable } from '@components/bookmarks-table/bookmarks-table'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { toSignal } from '@angular/core/rxjs-interop'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { Immutable } from 'signalstory'

@Component({
  selector: 'app-tag',
  imports: [HlmBadge, MainLayout, BigTag, BookmarksTable],
  templateUrl: './tag.html',
})
export default class Tag implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute)
  readonly #tagsService = inject(TagsService)
  readonly #bookmarksService = inject(BookmarksService)

  readonly #params = toSignal<Params | undefined>(this.#activatedRoute.params)
  readonly #requestedTag = computed<string | null>(() => this.#params()?.['tag'])
  // for the ugly transformations done here:
  // @see: https://github.com/zuriscript/signalstory/discussions/114
  readonly #tags: Signal<TagVM[]> = computed(() => {
    let immutableTags: Immutable<TagVM[]> = this.#tagsService.tags()
    let mutableTagList: TagVM[] = [...immutableTags]
    return mutableTagList
  })
  readonly tag = computed<TagVM | null>(() => {
    return this.#tags().find((tag: Immutable<TagVM>) => this.#requestedTag() == tag.name) ?? null
  })
  readonly bookmarks: Signal<BookmarkVM[]> = computed(() => {
    // transform Immutable<BookmarkVM[]> into BookmarkVM[]...
    const immutableBookmarks: Immutable<BookmarkVM[]> = this.#bookmarksService.bookmarks()
    const mutableListOfImmutableBookmarks: Immutable<BookmarkVM>[] = [...immutableBookmarks]
    const mutableBookmarks: BookmarkVM[] = mutableListOfImmutableBookmarks.map((bm) => {
      let mutableBm: BookmarkVM = { ...bm, tagsList: [...bm.tagsList] }
      return mutableBm
    })
    return mutableBookmarks.filter((bookmark) => bookmark.tags.includes(this.#params()?.['tag']))
  })

  async ngOnInit(): Promise<void> {
    await this.getTags()
  }

  async getTags(): Promise<void> {
    console.info('getting all tags...')
    await this.#tagsService.getAllTags()
  }
}

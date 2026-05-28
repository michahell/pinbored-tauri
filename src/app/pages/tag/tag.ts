import { Component, computed, inject, OnInit } from '@angular/core'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { BigTag } from '../../shared/components/big-tag/big-tag'
import { ActivatedRoute, Params } from '@angular/router'
import { TagsService } from '../../shared/services/tags/tags-service'
import { TagVM } from '@models/tag-view.model'
import { BookmarksTable } from '@components/bookmarks-table/bookmarks-table'
import { BookmarksService } from '../../shared/services/bookmarks/bookmarks-service'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { toSignal } from '@angular/core/rxjs-interop'
import { HlmBadge } from '@spartan-ng/helm/badge'

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
  readonly #tags = computed<TagVM[]>(() => this.#tagsService.tags())

  tag = computed<TagVM | null>(() => {
    return this.#tags().find((tag: TagVM) => this.#requestedTag() == tag.name) ?? null
  })

  bookmarks = computed<PinboardItemVM[]>(() =>
    this.#bookmarksService.bookmarks().filter((bookmark) => bookmark.tags.includes(this.#params()?.['tag']))
  )

  async ngOnInit(): Promise<void> {
    await this.getTags()
  }

  async getTags(): Promise<void> {
    console.info('getting all tags...')
    await this.#tagsService.getAllTags()
  }
}

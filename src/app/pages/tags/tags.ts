import { Component, computed, inject, OnInit, Signal } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { TagsTable } from '@components/tags-table/tags-table'
import { TagsService } from '@services/tags/tags-service'
import { HlmButtonGroup, HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { TagVM } from '@data-providers/abstract'
import { Immutable } from 'signalstory'

@Component({
  selector: 'app-tags',
  imports: [HlmButtonGroupImports, MainLayout, HlmButton, HlmSpinner, TagsTable, HlmButtonGroup],
  templateUrl: './tags.html',
})
export default class Tags implements OnInit {
  readonly #tagsService = inject(TagsService)
  // for the ugly transformations done here:
  // @see: https://github.com/zuriscript/signalstory/discussions/114
  readonly tags: Signal<TagVM[]> = computed(() => {
    const immutableTags: Immutable<TagVM[]> = this.#tagsService.tags()
    const mutableTagList: TagVM[] = [...immutableTags]
    return mutableTagList
  })
  readonly tagsFetching = computed(() => this.#tagsService.tagsFetching())
  readonly hasTags = computed(() => this.#tagsService.hasTags())

  async ngOnInit(): Promise<void> {
    await this.getTags()
  }

  async getTags(): Promise<void> {
    console.info('getting all tags...')
    await this.#tagsService.getAllTags()
  }
}

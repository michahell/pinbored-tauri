import { Component, computed, inject, OnInit } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import { TagsTable } from '@components/tags-table/tags-table'
import { TagsService } from '../../shared/services/tags/tags-service'
import { HlmButtonGroup, HlmButtonGroupImports } from '@spartan-ng/helm/button-group'

@Component({
  selector: 'app-tags',
  imports: [HlmButtonGroupImports, MainLayout, HlmButton, HlmSpinner, TagsTable, HlmButtonGroup],
  templateUrl: './tags.html',
})
export default class Tags implements OnInit {
  readonly #tags = inject(TagsService)

  readonly tags = computed(() => this.#tags.tags())
  readonly tagsFetching = computed(() => this.#tags.tagsFetching())
  readonly hasTags = computed(() => this.#tags.hasTags())

  async ngOnInit(): Promise<void> {
    await this.getTags()
  }

  async getTags(): Promise<void> {
    console.info('getting all tags...')
    await this.#tags.getAllTags()
  }
}

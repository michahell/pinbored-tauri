import { Component, computed, inject, signal } from '@angular/core'
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog'
import { hlmMuted } from '@spartan-ng/helm/typography'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { TagsService } from '@services/tags/tags-service'
import { TagModalService } from '@services/tags/tag-modal-service'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { TagVM } from '@data-providers/abstract/models/abstract-view.model'

@Component({
  selector: 'app-tag-edit-modal',
  imports: [HlmDialogImports, HlmButtonImports, HlmInputImports],
  templateUrl: './tag-edit-modal.html',
})
export class TagEditModal {
  readonly #tagsService = inject(TagsService)
  readonly #tagModalService = inject(TagModalService)
  readonly #bookmarksService = inject(BookmarksService)
  readonly #dialogContext = injectBrnDialogContext<{ selectedTag: TagVM }>()

  protected readonly hlmMuted = hlmMuted
  protected readonly tag = this.#dialogContext.selectedTag
  protected readonly newName = signal('')

  protected readonly taggedBookmarks = computed(() => {
    if (!this.tag) return []
    return this.#bookmarksService.bookmarks().filter((b) => {
      return b.tagsList.includes(this.tag.name)
    })
  })

  constructor() {
    if (this.tag) {
      this.newName.set(this.tag.name)
    }
  }

  close(): void {
    this.#tagModalService.closeTagEditModal()
  }

  async save(): Promise<void> {
    const tag = this.tag
    if (!tag || !this.newName().trim()) return
    await this.#tagsService.renameTag(tag.name, this.newName().trim())
    this.#tagModalService.closeTagEditModal()
  }
}

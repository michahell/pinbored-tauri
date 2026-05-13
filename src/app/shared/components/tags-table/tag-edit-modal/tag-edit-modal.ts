import { Component, computed, inject, signal } from '@angular/core'
import { TagsService } from '../../../../pages/tags/tags-service'
import { BookmarksService } from '../../../../pages/bookmarks/bookmarks-service'
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog'
import { TagVM } from '@models/tag-view.model'
import { hlmMuted } from '@spartan-ng/helm/typography'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'

@Component({
  selector: 'app-tag-edit-modal',
  imports: [HlmDialogImports, HlmButtonImports, HlmInputImports],
  templateUrl: './tag-edit-modal.html',
})
export class TagEditModal {
  readonly #tagsService = inject(TagsService)
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
    this.#tagsService.closeTagEditModal()
  }

  async save(): Promise<void> {
    const tag = this.tag
    if (!tag || !this.newName().trim()) return
    await this.#tagsService.renameTag(tag.name, this.newName().trim())
    this.#tagsService.closeTagEditModal()
  }
}

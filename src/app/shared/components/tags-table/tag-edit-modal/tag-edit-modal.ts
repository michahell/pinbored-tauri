import { Component, computed, inject, signal } from '@angular/core'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { hlmMuted } from '@spartan-ng/helm/typography'
import { TagsService } from '../../../../pages/tags/tags-service'
import { TagEditStateService } from '../tag-edit-state.service'
import { BookmarksService } from '../../../../pages/bookmarks/bookmarks-service'

@Component({
  selector: 'app-tag-edit-modal',
  imports: [HlmDialogImports, HlmButtonImports, HlmInputImports],
  templateUrl: './tag-edit-modal.html',
})
export class TagEditModal {
  readonly #tagsService = inject(TagsService)
  readonly #tagEditState = inject(TagEditStateService)
  readonly #bookmarksService = inject(BookmarksService)

  protected readonly hlmMuted = hlmMuted
  protected readonly tag = this.#tagEditState.selectedTag
  protected readonly newName = signal('')

  protected readonly taggedBookmarks = computed(() => {
    const tag = this.tag()
    if (!tag) return []
    return this.#bookmarksService.bookmarks().filter((b) => b.tagsList.includes(tag.name))
  })

  constructor() {
    const currentTag = this.#tagEditState.selectedTag()
    if (currentTag) {
      this.newName.set(currentTag.name)
    }
  }

  async save(): Promise<void> {
    const tag = this.tag()
    if (!tag || !this.newName().trim()) return
    await this.#tagsService.renameTag(tag.name, this.newName().trim())
    this.#tagEditState.close()
  }

  cancel(): void {
    this.#tagEditState.close()
  }
}

import { Component, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePencil, lucideTrash2 } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { TagVM } from '../../models/tag-view.model'
import { TagsService } from '../../services/tags/tags-service'
import { TagEditStateService } from './tag-edit-state.service'
import { TagEditModal } from './tag-edit-modal/tag-edit-modal'

@Component({
  selector: 'app-tag-action-cell',
  imports: [NgIcon, HlmButtonImports, HlmIconImports, HlmAlertDialogImports],
  providers: [provideIcons({ lucidePencil, lucideTrash2 })],
  template: `
    <!-- edit button -->
    <button hlmBtn variant="ghost" size="icon-sm" (click)="openEditModal()">
      <ng-icon hlm size="sm" name="lucidePencil" />
      <span class="sr-only">edit tag</span>
    </button>

    <!-- delete with confirmation -->
    <hlm-alert-dialog>
      <button hlmBtn variant="ghost" size="icon-sm" hlmAlertDialogTrigger>
        <ng-icon hlm size="sm" name="lucideTrash2" />
        <span class="sr-only">delete tag</span>
      </button>
      <div hlmAlertDialogPortal>
        <hlm-alert-dialog-content>
          <div hlmAlertDialogHeader>
            <h3 hlmAlertDialogTitle>Delete "{{ _tag.name }}"</h3>
            <p hlmAlertDialogDescription>
              This will remove the tag from all bookmarks. This action cannot be undone.
            </p>
          </div>
          <div hlmAlertDialogFooter>
            <button hlmAlertDialogCancel>Cancel</button>
            <button hlmAlertDialogAction (click)="deleteTag()">Delete</button>
          </div>
        </hlm-alert-dialog-content>
      </div>
    </hlm-alert-dialog>
  `,
})
export class TagActionCell {
  readonly #context = injectFlexRenderContext<CellContext<TagVM, unknown>>()
  readonly #tagsService = inject(TagsService)
  readonly #tagEditState = inject(TagEditStateService)
  readonly #dialogService = inject(HlmDialogService)

  protected get _tag(): TagVM {
    return this.#context.row.original
  }

  openEditModal(): void {
    this.#tagEditState.selectedTag.set(this._tag)
    const ref = this.#dialogService.open(TagEditModal, { contentClass: 'sm:max-w-2xl' })
    this.#tagEditState.close = () => ref.close()
  }

  async deleteTag(): Promise<void> {
    await this.#tagsService.deleteTag(this._tag.name)
  }
}

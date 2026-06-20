import { Component, inject } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { TagsService } from '@services/tags/tags-service'
import { TagModalService } from '@services/tags/tag-modal-service'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { TagVM } from '@data-providers/abstract/models/abstract-view.model'

@Component({
  imports: [NgIcon, HlmButtonImports, HlmIconImports, HlmAlertDialogImports],
  providers: [],
  templateUrl: 'cell-tag-action-renderer.html',
})
export class CellTagActionRenderer {
  readonly #context = injectFlexRenderContext<CellContext<TagVM, unknown>>()
  readonly #tagsService = inject(TagsService)
  readonly #tagModalService = inject(TagModalService)

  get tag(): TagVM {
    return this.#context.row.original
  }

  openEditModal(): void {
    this.#tagModalService.openTagEditModal(this.tag)
  }

  async deleteTag(ctx: { close: () => void }): Promise<void> {
    await this.#tagsService.deleteTag(this.tag.name)
    ctx.close()
  }
}

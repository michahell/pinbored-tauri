import { inject, Service } from '@angular/core'
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { BrnDialogRef } from '@spartan-ng/brain/dialog'
import { TagEditModal } from '@components/tags-table/tag-edit-modal/tag-edit-modal'
import { TagVM } from '@data-providers/abstract/models/abstract-view.model'

@Service()
export class TagModalService {
  readonly #dialogService = inject(HlmDialogService)

  #tagEditModalRef: BrnDialogRef | null = null

  openTagEditModal(tag: TagVM): void {
    const context = { selectedTag: tag }
    if (this.#tagEditModalRef == null || this.#tagEditModalRef.state() === 'closed') {
      this.#tagEditModalRef = this.#dialogService.open(TagEditModal, { context, contentClass: 'sm:max-w-2xl' })
    }
  }

  closeTagEditModal(): void {
    this.#tagEditModalRef?.close()
  }
}

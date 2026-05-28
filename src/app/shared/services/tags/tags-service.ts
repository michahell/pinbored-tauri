import { computed, inject, Injectable, signal } from '@angular/core'
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { BrnDialogRef } from '@spartan-ng/brain/dialog'
import { PinboardFacade } from '@core/pinboard/pinboard-facade'
import { LocalStoreService } from '@core/store/local-store-service'
import { TagVM } from '@models/tag-view.model'
import { TagEditModal } from '@components/tags-table/tag-edit-modal/tag-edit-modal'
import { PinboardTagsMap } from '@models/pinboard.model'

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  readonly #facade = inject(PinboardFacade)
  readonly #localStore = inject(LocalStoreService)
  readonly #dialogService = inject(HlmDialogService)

  readonly tags = signal<TagVM[]>([])
  readonly tagsFetching = signal(false)
  readonly hasTags = computed(() => this.tags().length > 0)

  #tagEditModalRef: BrnDialogRef<any> | null = null

  async getAllTags(): Promise<void> {
    this.tagsFetching.set(true)
    await this.#facade
      .getAllTags()
      .then((tagsMap) => {
        this.tags.set(this.#mapToTagVMs(tagsMap))
      })
      .catch((err) => {
        this.tags.set([])
        console.error('ERRORED!', err)
      })
      .finally(() => {
        this.tagsFetching.set(false)
      })
  }

  async renameTag(oldName: string, newName: string): Promise<void> {
    await this.#facade.renameTag(oldName, newName)
    this.tags.update((tags) => tags.map((t) => (t.name === oldName ? { ...t, name: newName } : t)))
    await this.#updateTagsInLocalStore()
  }

  async deleteTag(name: string): Promise<void> {
    await this.#facade.deleteTag(name)
    this.tags.update((tags) => tags.filter((t) => t.name !== name))
    await this.#updateTagsInLocalStore()
  }

  openTagEditModal(tag: TagVM): void {
    const context = {
      selectedTag: tag,
    }
    if (this.#tagEditModalRef == null || this.#tagEditModalRef.state() === 'closed') {
      this.#tagEditModalRef = this.#dialogService.open(TagEditModal, { context, contentClass: 'sm:max-w-2xl' })
    }
  }

  closeTagEditModal(): void {
    this.#tagEditModalRef?.close()
  }

  async #updateTagsInLocalStore(): Promise<void> {
    const tagsMap: PinboardTagsMap = Object.fromEntries(this.tags().map((t) => [t.name, String(t.count)]))
    await this.#localStore.set('tags', tagsMap)
  }

  #mapToTagVMs(tagsMap: PinboardTagsMap): TagVM[] {
    return Object.entries(tagsMap).map(([name, count]) => ({ name, count: Number(count) }))
  }
}

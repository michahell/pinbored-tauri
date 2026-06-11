import { computed, inject, Service, Signal, signal } from '@angular/core'
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { BrnDialogRef } from '@spartan-ng/brain/dialog'
import { TagEditModal } from '@components/tags-table/tag-edit-modal/tag-edit-modal'
import { DataProviderFacade } from '@services/data-provider/data-provider-facade'
import { TagsVM, TagVM, SuggestTagsResultVM } from '@data-providers/abstract'
import { SignalStore } from '@services/signal-store'
import { Immutable } from 'signalstory'

@Service()
export class TagsService {
  readonly #facade = inject(DataProviderFacade)
  readonly #signalStore = inject(SignalStore)
  readonly #dialogService = inject(HlmDialogService)

  readonly tags: Signal<Immutable<TagVM[]>> = computed(() => this.#signalStore.tags())
  readonly hasTags = computed(() => this.#signalStore.hasTags())
  readonly tagsFetching = signal(false)

  #tagEditModalRef: BrnDialogRef | null = null

  async getAllTags(): Promise<void> {
    this.tagsFetching.set(true)
    await this.#facade
      .getAllTags()
      .then((tagsMap) => {
        this.#signalStore.setTags(this.#mapToTagVMs(tagsMap))
      })
      .catch((err) => {
        this.#signalStore.setTags([])
        console.error('ERRORED!', err)
      })
      .finally(() => {
        this.tagsFetching.set(false)
      })
  }

  async renameTag(oldName: string, newName: string): Promise<void> {
    await this.#facade.renameTag(oldName, newName)
    this.#signalStore.mutateTag(oldName, newName)
  }

  async deleteTag(name: string): Promise<void> {
    await this.#facade.deleteTag(name)
    this.#signalStore.deleteTag(name)
  }

  async suggestTagsForUrl(bookmarkUrl: string): Promise<SuggestTagsResultVM> {
    return this.#facade.suggestTagsForUrl(bookmarkUrl)
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

  #mapToTagVMs(tagsMap: TagsVM): TagVM[] {
    return Object.entries(tagsMap).map(([name, count]) => ({ name, count: Number(count) }))
  }
}

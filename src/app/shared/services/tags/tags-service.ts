import { computed, inject, Service, Signal, signal } from '@angular/core'
import { DataProviderFacade } from '@services/data-provider/data-provider-facade'
import { TagsVM, TagVM, SuggestTagsResultVM } from '@data-providers/abstract/models/abstract-view.model'
import { SignalStore } from '@services/signal-store/signal-store'
import { Immutable } from 'signalstory'

@Service()
export class TagsService {
  readonly #facade = inject(DataProviderFacade)
  readonly #signalStore = inject(SignalStore)

  readonly tags: Signal<Immutable<TagVM[]>> = computed(() => this.#signalStore.tags())
  readonly hasTags = computed(() => this.#signalStore.hasTags())
  readonly tagsFetching = signal(false)

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

  #mapToTagVMs(tagsMap: TagsVM): TagVM[] {
    return Object.entries(tagsMap).map(([name, count]) => ({ name, count: Number(count) }))
  }
}

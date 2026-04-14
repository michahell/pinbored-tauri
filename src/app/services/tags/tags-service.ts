import { computed, inject, Injectable, signal } from '@angular/core'
import { PinboardFacade } from '../pinboard/pinboard-facade'
import { LocalStoreService } from '../store/local-store-service'
import { PinboardTagsMap } from '../../models/pinboard.model'
import { TagVM } from '../../models/tag-view.model'

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  readonly #facade = inject(PinboardFacade)
  readonly #localStore = inject(LocalStoreService)

  readonly tags = signal<TagVM[]>([])
  readonly tagsFetching = signal(false)
  readonly hasTags = computed(() => this.tags().length > 0)

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

  #mapToTagVMs(tagsMap: PinboardTagsMap): TagVM[] {
    return Object.entries(tagsMap).map(([name, count]) => ({ name, count: Number(count) }))
  }

  async #updateTagsInLocalStore(): Promise<void> {
    const tagsMap: PinboardTagsMap = Object.fromEntries(this.tags().map((t) => [t.name, String(t.count)]))
    await this.#localStore.set('tags', tagsMap)
  }
}

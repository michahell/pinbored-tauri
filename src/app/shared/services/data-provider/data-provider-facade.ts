import { inject, Injector, Service } from '@angular/core'
import {
  AbstractDataProviderFacade,
  IDataProviderFacade,
  BookmarkVM,
  TagsVM,
  SuggestTagsResultVM,
} from '@data-providers/abstract'
import { PinboardFacade } from '@data-providers/pinboard'
import { SqliteFacade } from '@data-providers/sqlite'

@Service()
export class DataProviderFacade implements IDataProviderFacade {
  readonly #injector = inject(Injector)

  concreteFacade!: AbstractDataProviderFacade

  constructor() {
    this.#setDataService('pinboard')
  }

  #setDataService(dataProvider: 'pinboard' | 'sql'): void {
    switch (dataProvider) {
      case 'pinboard':
        this.concreteFacade = this.#injector.get(PinboardFacade)
        break
      case 'sql':
        this.concreteFacade = this.#injector.get(SqliteFacade)
        break
      default:
        throw new Error(`Unknown data provider type: ${dataProvider}`)
    }
  }

  getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]> {
    return this.concreteFacade.getAllBookmarks(via)
  }

  getAllTags(): Promise<TagsVM> {
    return this.concreteFacade.getAllTags()
  }

  renameTag(oldName: string, newName: string): Promise<unknown> {
    return this.concreteFacade.renameTag(oldName, newName)
  }

  deleteTag(name: string): Promise<unknown> {
    return this.concreteFacade.deleteTag(name)
  }

  deleteBookmark(url: string): Promise<unknown> {
    return this.concreteFacade.deleteBookmark(url)
  }

  suggestTagsForUrl(url: string): Promise<SuggestTagsResultVM> {
    return this.concreteFacade.suggestTagsForUrl(url)
  }
}

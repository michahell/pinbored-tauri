import { Service } from '@angular/core'
import { IDataProviderFacade } from '@data-providers/abstract/facade/data-provider-facade.interface'
import { BookmarkVM, TagsVM, SuggestTagsResultVM } from '@data-providers/abstract/models/abstract-view.model'

@Service()
export abstract class AbstractDataProviderFacade implements IDataProviderFacade {
  abstract getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]>
  abstract getAllTags(): Promise<TagsVM>
  abstract renameTag(oldName: string, newName: string): Promise<unknown>
  abstract deleteTag(name: string): Promise<unknown>
  abstract deleteBookmark(url: string): Promise<unknown>
  abstract suggestTagsForUrl(url: string): Promise<SuggestTagsResultVM>
}

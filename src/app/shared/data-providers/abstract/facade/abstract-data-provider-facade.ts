import { Service } from '@angular/core'
import { IDataProviderFacade, BookmarkVM, TagsVM, SuggestTagsResultVM } from '@data-providers/abstract'

@Service()
export abstract class AbstractDataProviderFacade implements IDataProviderFacade {
  abstract getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]>
  abstract getAllTags(): Promise<TagsVM>
  abstract renameTag(oldName: string, newName: string): Promise<unknown>
  abstract deleteTag(name: string): Promise<unknown>
  abstract deleteBookmark(url: string): Promise<unknown>
  abstract suggestTagsForUrl(url: string): Promise<SuggestTagsResultVM>
}

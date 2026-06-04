import { Service } from '@angular/core'
import { AbstractDataProviderFacade, BookmarkVM, TagsVM } from '@data-providers/abstract'

@Service()
export class SqliteFacade extends AbstractDataProviderFacade {
  override getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]> {
    throw new Error('Method not implemented.')
  }
  override getAllTags(): Promise<TagsVM> {
    throw new Error('Method not implemented.')
  }
  override renameTag(oldName: string, newName: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  override deleteTag(name: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  override deleteBookmark(url: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  override suggestTagsForUrl(url: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}

import { Service } from '@angular/core'
import { AbstractDataProviderFacade } from '@data-providers/abstract/facade/abstract-data-provider-facade'
import { BookmarkVM, SuggestTagsResultVM, TagsVM } from '@data-providers/abstract/models/abstract-view.model'

@Service()
export class SqliteFacade extends AbstractDataProviderFacade {
  override getAllBookmarks(): Promise<BookmarkVM[]> {
    throw new Error('Method not implemented.')
  }
  override getAllTags(): Promise<TagsVM> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override renameTag(oldName: string, newName: string): Promise<never> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override deleteTag(name: string): Promise<never> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override deleteBookmark(url: string): Promise<never> {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override suggestTagsForUrl(url: string): Promise<SuggestTagsResultVM> {
    throw new Error('Method not implemented.')
  }
}

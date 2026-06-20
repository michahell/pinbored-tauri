import { BookmarkVM, TagsVM, SuggestTagsResultVM } from '@data-providers/abstract/models/abstract-view.model'

export interface IDataProviderFacade {
  getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]>
  getAllTags(): Promise<TagsVM>
  renameTag(oldName: string, newName: string): Promise<unknown>
  deleteTag(name: string): Promise<unknown>
  deleteBookmark(url: string): Promise<unknown>
  suggestTagsForUrl(url: string): Promise<SuggestTagsResultVM>
}

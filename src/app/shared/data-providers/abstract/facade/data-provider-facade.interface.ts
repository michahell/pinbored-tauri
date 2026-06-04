import { BookmarkVM, SuggestTagsResult, TagsVM } from '@data-providers/abstract'

export interface IDataProviderFacade {
  getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]>
  getAllTags(): Promise<TagsVM>
  renameTag(oldName: string, newName: string): Promise<unknown>
  deleteTag(name: string): Promise<unknown>
  deleteBookmark(url: string): Promise<unknown>
  suggestTagsForUrl(url: string): Promise<SuggestTagsResult>
}

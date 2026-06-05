import { AbstractDataProviderFacade } from './facade/abstract-data-provider-facade'
import { IDataProviderFacade } from './facade/data-provider-facade.interface'
import { Bookmark, Tag, Tags, Note, SuggestTagsResult } from './models/abstract.model'
import { BookmarkVM, TagVM, TagsVM, NoteVM, SuggestTagsResultVM } from './models/abstract-view.model'

export {
  AbstractDataProviderFacade,
  type IDataProviderFacade,
  type BookmarkVM,
  type TagVM,
  type TagsVM,
  type NoteVM,
  type SuggestTagsResultVM,
  type Bookmark,
  type Tag,
  type Tags,
  type Note,
  type SuggestTagsResult,
}

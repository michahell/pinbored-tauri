import { Bookmark, Note, Tag, Tags } from '@data-providers/abstract/models/abstract.model'
import { StaleStatus } from '@services/stale-checker'

export interface BookmarkVM extends Bookmark {
  tagsList: string[]
  status: StaleStatus
  changeHash: string
}

export interface TagVM extends Tag {
  name: string
  count: number
}

export interface NoteVM extends Note {}

export type TagsVM = Tags

export interface SuggestTagsResultVM {
  popular: string[]
  recommended: string[]
}

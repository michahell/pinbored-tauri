import { Bookmark, Note, Tag, Tags } from '@data-providers/abstract'
import { StaleStatus } from '@services/stale-checker/stale-checker.model'

export interface BookmarkVM extends Bookmark {
  tagsList: string[]
  status: StaleStatus
  changeHash: string
}

export interface TagVM extends Tag {
  name: string
  count: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NoteVM extends Note {}

export type TagsVM = Tags

export interface SuggestTagsResultVM {
  popular: string[]
  recommended: string[]
}

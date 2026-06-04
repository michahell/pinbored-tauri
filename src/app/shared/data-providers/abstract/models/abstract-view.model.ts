import { Bookmark, Note, Tag, Tags } from '@data-providers/abstract/models/abstract.model'
import { StaleStatus } from '@services/stale-checker/stale-checker.model'

export interface BookmarkVM extends Bookmark {
  tagsList: string[]
  status: StaleStatus
}

export interface TagVM extends Tag {
  name: string
  count: number
}

export interface NoteVM extends Note {}

export type TagsVM = Tags

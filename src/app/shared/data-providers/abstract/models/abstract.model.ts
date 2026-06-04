export interface Bookmark {
  description?: string
  extended: string
  hash: string
  href: string
  meta: string
  shared: string
  tags: string
  time: string
  toread: string
}

export interface Tag {
  name: string
  count: number
}

export type Tags = Record<string, string>

export interface Note {
  id: string
  title: string
  created_at: string
  updated_at: string
  length: number
}

export type SuggestTagsResult = [{ popular: string[] }, { recommended: string[] }]
